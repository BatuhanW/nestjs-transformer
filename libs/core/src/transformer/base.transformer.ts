import {
  AnyObject,
  ValidationResult,
  TransformerRuntimeError,
  TransformerValidationError,
} from '@core';

export abstract class BaseTransformer<Payload = AnyObject, Result = AnyObject> {
  public validate(_payload: Payload): ValidationResult {
    return { success: true };
  }

  abstract perform(payload: Payload): Result;

  // eslint-disable-next-line
  public onSuccess(_payload: Result): void | Promise<void> {}

  public onError(
    error: TransformerValidationError | TransformerRuntimeError,
  ): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
