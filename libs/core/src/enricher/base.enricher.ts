import {
  AnyObject,
  ValidationResult,
  HandleStepRuntimeError,
  HandleStepValidationError,
} from '@core';

export abstract class BaseEnricher<Payload = AnyObject, Result = AnyObject> {
  public validate(_payload: Payload): ValidationResult {
    return { success: true };
  }

  abstract perform(payload: Payload): Promise<Result>;

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
