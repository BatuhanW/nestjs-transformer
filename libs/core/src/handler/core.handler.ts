import { BaseTransformer, BaseEnricher, BaseDestination, AnyObject } from '@core';

export abstract class CoreHandler<Payload = AnyObject> {
  protected transformer?: BaseTransformer;
  protected enricher?: BaseEnricher;
  protected destinations: { transformer?: BaseTransformer; destination: BaseDestination }[] = [];

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
