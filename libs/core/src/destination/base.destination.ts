import { AnyObject } from '@core';

export abstract class BaseDestination<Payload extends AnyObject = AnyObject> {
  abstract perform(payload: Payload): Promise<void>;

  public onError?(error: Error): void | Promise<void>;
  public onSuccess?(): void | Promise<void>;
}
