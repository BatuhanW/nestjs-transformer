import { CoreHandler } from './core.handler';
import { AnyObject, HandleStepValidationError, HandleStepRuntimeError } from '@core';
import { CorePerformable } from '@core/core.performable';

export class BaseHandler<IncomingPayload = AnyObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    await this.onStart(payload);

    const transformedPayload = await BaseHandler.handleStep(payload, this.transformer);

    const enrichedPayload = await BaseHandler.handleStep(transformedPayload, this.enricher);

    await Promise.all(
      this.destinations.map(({ transformer, destination }) =>
        destination
          .perform(enrichedPayload)
          .then(() => destination.onSuccess())
          .catch((error) => destination.onError(error)),
      ),
    ).then(async () => {
      await this.onSuccess();
    });
  }

  private static async handleStep(
    payload: AnyObject,
    stepHandler?: CorePerformable<AnyObject, AnyObject>,
  ): Promise<AnyObject> {
    if (!stepHandler) return payload;

    const validationResult = (await stepHandler.validate?.(payload)) ?? { success: true };

    if (validationResult.success === false) {
      const stepHandlerError = new HandleStepValidationError(
        stepHandler.constructor.name,
        payload,
        validationResult.message,
      );

      await stepHandler.onError?.(stepHandlerError);

      throw stepHandlerError;
    }

    let processedPayload: AnyObject;

    try {
      processedPayload = await stepHandler.perform(payload);
    } catch (error: any) {
      const stepHandlerError = new HandleStepRuntimeError(
        stepHandler.constructor.name,
        payload,
        error.message,
      );

      await stepHandler.onError?.(stepHandlerError);

      throw stepHandlerError;
    }

    await stepHandler.onSuccess?.(processedPayload);

    return processedPayload;
  }
}
