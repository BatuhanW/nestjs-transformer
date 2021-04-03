import { DefaultObject, ValidationResult } from '@core';

import { EnricherRuntimeError, EnricherValidationError } from '../handler/errors';

export abstract class BaseEnricher<Payload = DefaultObject, Result = DefaultObject> {
  public validate(_payload: Payload): ValidationResult {
    return { success: true };
  }

  abstract perform(payload: Payload): Promise<Result>;

  // eslint-disable-next-line
  public onSuccess(_payload: Result): void | Promise<void> {}

  public onError(error: EnricherValidationError | EnricherRuntimeError): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
