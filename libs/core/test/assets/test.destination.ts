import { BaseDestination, DefaultObject } from '@core';

export class TestDestination<Payload = DefaultObject> extends BaseDestination<Payload> {
  // eslint-disable-next-line
  async perform(_payload: Payload): Promise<void> {}

  // eslint-disable-next-line
  async onSuccess(): Promise<void> {}

  async onError(error: Error): Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
