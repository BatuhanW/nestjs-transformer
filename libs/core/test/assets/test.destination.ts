import { BaseDestination, AnyObject } from '@core';

export class TestDestination<Payload = AnyObject> extends BaseDestination<Payload> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async perform(_payload: Payload): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSuccess(): void | Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onError(_error: Error): void | Promise<void> {}
}
