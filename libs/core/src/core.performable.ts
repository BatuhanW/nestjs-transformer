import {
  AnyObject,
  ValidationResult,
  HandleStepRuntimeError,
  HandleStepValidationError,
} from '@core';

export abstract class CorePerformable<Payload extends AnyObject, Result extends AnyObject> {
  public validate?(payload: Payload): ValidationResult | Promise<ValidationResult>;

  abstract perform(payload: Payload): Result | Promise<Result>;

  public onSuccess?(payload: Result): void | Promise<void>;

  public onError?(error: HandleStepValidationError | HandleStepRuntimeError): void | Promise<void>;
}
