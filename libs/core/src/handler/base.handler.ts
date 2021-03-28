import { iif, of, throwError } from 'rxjs';
import { catchError, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { DefaultObject, ValidationFailResult } from '../types';

import { CoreHandler } from './core.handler';

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    const finalPayload = await of(payload)
      .pipe(
        tap((initialPayload) => this.onStart(initialPayload)),
        mergeMap((initialPayload) =>
          iif(
            () => this.transformer.validate(initialPayload).success === true,
            of(this.transformer.perform(initialPayload)),
            throwError((this.transformer.validate(initialPayload) as ValidationFailResult).message),
          ),
        ),
        catchError((error) => {
          this.transformer.onError(error);

          return of({ error: true });
        }),
        takeWhile((possibleError) => !possibleError.error),
        tap((transformedPayload) => this.transformer.onSuccess(transformedPayload)),
        mergeMap((transformedPayload) =>
          iif(
            () => this.enricher.validate(transformedPayload).success === true,
            this.enricher.perform(transformedPayload),
            throwError(
              (this.enricher.validate(transformedPayload) as ValidationFailResult).message,
            ),
          ),
        ),
        catchError((error) => {
          this.enricher.onError(error);

          return of({ error: true });
        }),
        takeWhile((possibleError) => !possibleError.error),
        tap((enrichedPayload) => this.enricher.onSuccess(enrichedPayload)),
      )
      .toPromise();

    await Promise.all(
      this.destinations.map((destination) =>
        destination
          .perform(finalPayload)
          .then(() => destination.onSuccess())
          .catch((error) => destination.onError(error)),
      ),
    );
  }
}
