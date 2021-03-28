import { iif, of, EMPTY, throwError } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { DefaultObject } from '../types';
import { CoreHandler } from './core.handler';

export class TransformerValidationError extends Error {}

export class BaseHandler<IncomingPayload = DefaultObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    const finalPayload = await of(payload)
      .pipe(
        tap((initialPayload) => this.onStart(initialPayload)),
        mergeMap((initialPayload) =>
          this.transformer.validate(initialPayload).success === true
            ? of(this.transformer.perform(initialPayload)).pipe(
                tap((transformedPayload) => this.transformer.onSuccess(transformedPayload)),
                mergeMap((transformedPayload) =>
                  iif(
                    () => this.enricher.validate(transformedPayload).success === true,
                    of(this.enricher.perform(transformedPayload)).pipe(
                      mergeMap((enrichedPayload) => enrichedPayload),
                      tap((enrichedPayload) => this.enricher.onSuccess(enrichedPayload)),
                    ),
                    EMPTY,
                  ),
                ),
              )
            : throwError(new TransformerValidationError('err')),
        ),
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
