import { DefaultObject, ValidationResult } from '../types';

export abstract class BaseTransformer<Payload = DefaultObject, Result = DefaultObject> {
  public validate(_payload: Payload): ValidationResult | Promise<ValidationResult> {
    return { success: true };
  }

  abstract perform(payload: Payload): Payload | Result;

  // eslint-disable-next-line
  public onSuccess(_payload: Payload): void | Promise<void> {}
}
