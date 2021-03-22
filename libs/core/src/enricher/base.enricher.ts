import { DefaultObject, ValidationFailResult, ValidationResult } from '../types';

export abstract class BaseEnricher<Payload = DefaultObject, Result = DefaultObject> {
  public validate(_payload: Payload): ValidationResult | Promise<ValidationResult> {
    return { success: true };
  }

  abstract perform(payload: Payload): Promise<Payload | Result>;

  public onValidationError({ message }: ValidationFailResult): void | Promise<void> {
    console.dir({
      level: 'WARNING',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      message,
    });
  }

  // eslint-disable-next-line
  public onSuccess(_payload: Payload): void | Promise<void> {}
}
