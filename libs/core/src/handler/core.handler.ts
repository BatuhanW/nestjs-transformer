import { BaseTransformer, BaseEnricher, BaseDestination, AnyObject } from '@core';

export abstract class CoreHandler<Payload = AnyObject> {
  protected transformer?: BaseTransformer;
  protected enricher?: BaseEnricher;
  protected destinations: { transformer?: BaseTransformer; destination: BaseDestination }[] = [];

  public onStart?(payload: Payload): void | Promise<void>;
  public onError?(error: Error): void | Promise<void>;
  public onSuccess?(): void | Promise<void>;
}
