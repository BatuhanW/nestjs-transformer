import {
  BaseTransformer,
  BaseEnricher,
  BaseDestination,
  DefaultObject,
  ValidationResult,
} from '@core';
import { PerformableRuntimeError, PerformableValidationError } from '@core/errors';
import { EmptyPerformable } from '@core/empty.performable';

export abstract class CoreHandler<Payload = DefaultObject> {
  protected transformer: BaseTransformer = new EmptyPerformable();
  protected enricher: BaseEnricher = new EmptyPerformable();
  protected destinations: { transformer: BaseTransformer; destination: BaseDestination }[] = [];

  /* eslint-disable @typescript-eslint/no-empty-function */
  public onStart(_payload: Payload): void | Promise<void> {}
  public onSuccess(): void | Promise<void> {}
  /* eslint-enable @typescript-eslint/no-empty-function */

  onError(error: Error): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
