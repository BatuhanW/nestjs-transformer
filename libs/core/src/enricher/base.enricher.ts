import { DefaultObject, ValidationResult } from '../types';

export abstract class BaseEnricher<Payload = DefaultObject, Result = DefaultObject> {
  public validate(_payload: Payload): ValidationResult | Promise<ValidationResult> {
    return { success: true };
  }

  abstract perform(payload: Payload): Promise<Payload | Result>;

  // eslint-disable-next-line
  public onSuccess(_payload: Payload): void | Promise<void> {}
}
