import { DefaultObject, ValidationFailResult, ValidationResult } from '../types';

export abstract class BaseEnricher<Payload = DefaultObject, Result = DefaultObject> {
  public validate(_payload: Payload): ValidationResult {
    return { success: false, message: 'swag' };
  }

  abstract perform(payload: Payload): Promise<Result>;

  public onValidationError({ message }: ValidationFailResult): void | Promise<void> {
    console.dir({
      level: 'WARNING',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      message,
    });
  }

  // eslint-disable-next-line
  public onSuccess(_payload: Result): void | Promise<void> {}

  public onError(error: Error): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
