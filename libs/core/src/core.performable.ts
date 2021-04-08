import {
  AnyObject,
  ValidationResult,
  HandleStepRuntimeError,
  HandleStepValidationError,
} from '@core';

export abstract class CorePerformable<Payload extends AnyObject, Result extends AnyObject> {
  public validate?(payload: Payload): ValidationResult | Promise<ValidationResult>;

  public abstract perform(payload: Payload): Result | Promise<Result>;

  public onError?(error: HandleStepValidationError | HandleStepRuntimeError): void | Promise<void>;
  public onSuccess?(payload: Result): void | Promise<void>;
}
