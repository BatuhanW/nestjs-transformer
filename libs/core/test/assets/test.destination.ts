import { BaseDestination, AnyObject } from '@core';

export class TestDestination<Payload = AnyObject> extends BaseDestination<Payload> {
  // eslint-disable-next-line
  async perform(_payload: Payload): Promise<void> {}
}
