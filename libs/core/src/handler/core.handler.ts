import { BaseTransformer } from '../transformer/base.transformer';
import { BaseEnricher } from '../enricher/base.enricher';
import { BaseDestination } from '../destination/base.destination';
import { DefaultObject, onError } from '../types';
import { EmptyEnricher } from '../enricher/empty.enricher';
import { EmptyTransformer } from '../transformer/empty.transformer';

export abstract class CoreHandler<Payload = DefaultObject> implements onError {
  protected transformer?: BaseTransformer = new EmptyTransformer();
  protected enricher?: BaseEnricher = new EmptyEnricher();
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
