import { of } from 'rxjs';
import { catchError, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { DefaultObject } from '../types';

import { CoreHandler } from './core.handler';

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    of(payload)
      .pipe(
        tap((initialPayload) => this.onStart(initialPayload)),
        mergeMap((initialPayload) => of(this.transformer.perform(initialPayload))),
        catchError((error) => {
          this.transformer.onError(error);

          return of({ error: true });
        }),
        takeWhile((possibleError) => !possibleError.error),
        tap((transformedPayload) => this.transformer.onSuccess(transformedPayload)),
        mergeMap((transformedPayload) => this.enricher.perform(transformedPayload)),
        tap((enrichedPayload) => this.enricher.onSuccess(enrichedPayload)),
        catchError((error) => {
          this.enricher.onError(error);

          return of({ error: true });
        }),
        takeWhile((possibleError) => !possibleError.error),
      )
      .subscribe({
        next: async (enrichedPayload) => {
          await Promise.all(
            this.destinations.map((destination) =>
              destination
                .perform(enrichedPayload)
                .then(() => destination.onSuccess())
                .catch((error) => destination.onError(error)),
            ),
          );
        },
      });
  }
}
