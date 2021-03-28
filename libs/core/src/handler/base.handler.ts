import { of, throwError } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { DefaultObject } from '../types';
import { CoreHandler } from './core.handler';

import { TransformerValidationError, EnricherValidationError } from './errors';

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    const finalPayload = await of(payload)
      .pipe(
        tap((initialPayload) => this.onStart(initialPayload)),
        mergeMap((initialPayload) => {
          const validationResult = this.transformer.validate(initialPayload);

          if (validationResult.success === true) {
            return of(this.transformer.perform(initialPayload)).pipe(
              tap((transformedPayload) => this.transformer.onSuccess(transformedPayload)),
              mergeMap((transformedPayload) => {
                const validationResult = this.enricher.validate(transformedPayload);

                if (validationResult.success === true) {
                  return of(this.enricher.perform(transformedPayload)).pipe(
                    mergeMap((enrichedPayload) => enrichedPayload),
                    tap((enrichedPayload) => this.enricher.onSuccess(enrichedPayload)),
                  );
                }

                return throwError(
                  new EnricherValidationError(
                    this.enricher.constructor.name,
                    transformedPayload,
                    validationResult.message,
                  ),
                );
              }),
            );
          }

          return throwError(
            new TransformerValidationError(
              this.transformer.constructor.name,
              initialPayload,
              validationResult.message,
            ),
          );
        }),
      )
      .toPromise();

    await Promise.all(
      this.destinations.map((destination) =>
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
