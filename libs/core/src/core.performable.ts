import { ValidationResult } from './types';
import { PerformableRuntimeError, PerformableValidationError } from '@core/handler/errors';

export abstract class CorePerformable<Payload, Result> {
  public async validate(_payload: Payload): Promise<ValidationResult> {
    return { success: true };
  }

  abstract perform(payload: Payload): Promise<Result>;

  // eslint-disable-next-line
  public async onSuccess(_payload: Result): Promise<void> {}

  onError(error: PerformableValidationError | PerformableRuntimeError): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
