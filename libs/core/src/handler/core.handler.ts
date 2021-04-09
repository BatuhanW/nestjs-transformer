import { BaseTransformer, BaseEnricher, Action, AnyObject } from '@core';

export abstract class CoreHandler<Payload = AnyObject> {
  protected transformer?: BaseTransformer;
  protected enricher?: BaseEnricher;
  protected actions: Action[] = [];

  public onStart?(payload: Payload): void | Promise<void>;
  public onError?(error: Error): void | Promise<void>;
  public onSuccess?(): void | Promise<void>;
}
