import { MuavinCore } from './muavin.core';
import {
  AnyObject,
  HandleStepValidationError,
  HandleStepRuntimeError,
  DestinationRuntimeError,
} from '@core';
import { CorePerformable } from '@core/core.performable';

export class Muavin<IncomingPayload = AnyObject> extends MuavinCore<IncomingPayload> {
  async handle(payload: IncomingPayload): Promise<AnyObject> {
    if (await this.skip?.(payload)) return;

    await this.onStart?.(payload);

    const enrichedPayload = await Muavin.handleStep(payload, this.enricher);

    const transformedPayload = await Muavin.handleStep(enrichedPayload, this.transformer);

    await this.onSuccess?.();

    return transformedPayload;
  }

  static async handleStep(
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

  async handleAction(enrichedPayload: AnyObject, actionName: string): Promise<void> {
    const { transformer, destination } = this.actions.find((action) => action.name === actionName);

    let transformedPayload = enrichedPayload;

    if (transformer) {
      transformedPayload = await Muavin.handleStep(enrichedPayload, transformer);
    }

    try {
      const result = await destination.perform(transformedPayload);
      await destination.onSuccess?.(result || undefined);
    } catch (error) {
      const destinationRuntimeError = new DestinationRuntimeError(
        destination.constructor.name,
        transformedPayload,
        error.message,
      );
      await destination.onError?.(destinationRuntimeError);

      throw destinationRuntimeError;
    }
  }
}
