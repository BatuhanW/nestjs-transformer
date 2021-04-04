import {
  AnyObject,
  ValidationResult,
  HandleStepRuntimeError,
  HandleStepValidationError,
} from '@core';

export abstract class CorePerformable<Payload extends AnyObject, Result extends AnyObject> {
  public validate(_payload: Payload): ValidationResult | Promise<ValidationResult> {
    return { success: true };
  }

  abstract perform(payload: Payload): Result | Promise<Result>;

  // eslint-disable-next-line
  public onSuccess(_payload: Result): void | Promise<void> {}

  public onError(error: HandleStepValidationError | HandleStepRuntimeError): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
