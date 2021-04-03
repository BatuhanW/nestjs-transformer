import { CoreHandler } from './core.handler';
import { AnyObject, HandleStepValidationError, HandleStepRuntimeError } from '@core';

export class BaseHandler<IncomingPayload = AnyObject> extends CoreHandler<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<void> {
    await this.onStart(payload);

    const transformedPayload = await BaseHandler.handleStep(this.transformer, payload);

    const enrichedPayload = await BaseHandler.handleStep(this.enricher, transformedPayload);

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

  private static async handleStep(stepHandler: any, payload: AnyObject): Promise<AnyObject> {
    const validationResult = await stepHandler.validate(payload);

    if (validationResult.success === false) {
      const stepHandlerError = new HandleStepValidationError(
        stepHandler.constructor.name,
        payload,
        validationResult.message,
      );

      await stepHandler.onError(stepHandlerError);

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

      stepHandler.onError(stepHandlerError);

      throw stepHandlerError;
    }

    stepHandler.onSuccess(processedPayload);

    return processedPayload;
  }
}
