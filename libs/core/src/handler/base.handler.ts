import { of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { DefaultObject } from '../interfaces';
import { CoreHandler } from './core.handler';

import { PerformableValidationError, PerformableRuntimeError } from '../errors';

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    const finalPayload = await of(payload)
      .pipe(
        tap((initialPayload) => this.onStart(initialPayload)),
        mergeMap((initialPayload) => {
          const validationResult = this.transformer.validate(initialPayload);

          if (validationResult.success === false) {
            const transformerError = new PerformableValidationError(
              this.transformer.constructor.name,
              initialPayload,
              validationResult.message,
            );

            this.transformer.onError(transformerError);

            return throwError(transformerError);
          }

          return of([]).pipe(
            map(() => this.transformer.perform(initialPayload)),
            catchError((error: Error) => {
              const transformerError = new PerformableRuntimeError(
                this.enricher.constructor.name,
                initialPayload,
                error.message,
              );

              this.transformer.onError(transformerError);

              return throwError(transformerError);
            }),
            tap((transformedPayload) => this.transformer.onSuccess(transformedPayload)),
            mergeMap((transformedPayload) => {
              const validationResult = this.enricher.validate(transformedPayload);

              if (validationResult.success === false) {
                const enricherError = new PerformableValidationError(
                  this.enricher.constructor.name,
                  transformedPayload,
                  validationResult.message,
                );

                this.enricher.onError(enricherError);

                return throwError(enricherError);
              }

              return of([]).pipe(
                mergeMap(() => this.enricher.perform(transformedPayload)),
                catchError((error: Error) => {
                  const enricherError = new PerformableRuntimeError(
                    this.enricher.constructor.name,
                    transformedPayload,
                    error.message,
                  );

                  this.enricher.onError(enricherError);

                  return throwError(enricherError);
                }),
                tap((enrichedPayload) => this.enricher.onSuccess(enrichedPayload)),
              );
            }),
          );
        }),
      )
      .toPromise();

    await Promise.all(
      this.destinations.map(({ transformer, destination }) =>
        destination
          .perform(finalPayload)
          .then(() => destination.onSuccess())
          .catch((error) => destination.onError(error)),
      ),
    ).then(async () => {
      await this.onSuccess();
    });
  }
}
