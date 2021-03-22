import { of } from 'rxjs';
import { catchError, mergeMap, takeWhile, tap } from 'rxjs/operators';

import { CoreHandler } from './core.handler';

export class BaseHandler<IncomingPayload = Record<string, any>> extends CoreHandler {
  async handle(payload: IncomingPayload): Promise<void> {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
    of(payload)
      .pipe(
        mergeMap((val) => of(this.transformer.perform(val))),
        tap((val) =>
          console.log(`[${this.constructor.name}] transformed payload`, { ...val }, '\n'),
        ),
        mergeMap((val) => this.enricher.perform(val)),
        tap((val) => console.log(`[${this.constructor.name}] enriched payload`, { ...val }, '\n')),
        catchError((error) => {
          this.onHandlerError(error);

          return of({ error: true });
        }),
        takeWhile((val) => !val.error),
      )
      .forEach((val) =>
        Promise.all(
          this.destinations.map((destination) => {
            console.log(
              `[${this.constructor.name}] calling destination ${destination.constructor.name}`,
              '\n',
            );
            return destination.perform(val);
          }),
        ),
      );
  }
}
