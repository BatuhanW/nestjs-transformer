import { from, of } from 'rxjs';
import { catchError, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { DefaultObject } from '../types';

import { CoreHandler } from './core.handler';

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    of(payload)
      .pipe(
        tap((val) => this.onStart(val)),
        mergeMap((val) => of(this.transformer.perform(val))),
        tap((val) => this.transformer.onSuccess(val)),
        mergeMap((val) => this.enricher.perform(val)),
        tap((val) => this.enricher.onSuccess(val)),
        catchError((error) => {
          this.onError(error);

          return of({ error: true });
        }),
        takeWhile((val) => !val.error),
      )
      .subscribe(
        {
          next: (val) => {
            from(this.destinations)
              .pipe(
                tap(async (dest) =>
                  dest
                    .perform(val)
                    .then(() => dest.onSuccess())
                    .catch((error) => this.onError(error)),
                ),
              )
              .subscribe();
          },
        },
        // Promise.all(
        //   this.destinations.map((destination) => {
        //     console.log(
        //       `[${this.constructor.name}] calling destination ${destination.constructor.name}`,
        //       '\n',
        //     );
        //     return destination.perform(val);
        //   }),
        // ),
      );
  }
}
