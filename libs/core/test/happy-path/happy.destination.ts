import { BaseDestination, DefaultObject } from '@core';

export class HappyDestination<Payload = DefaultObject> extends BaseDestination<Payload> {
  // eslint-disable-next-line
  async perform(_payload: Payload): Promise<void> {}

  // eslint-disable-next-line
  onSuccess(): void | Promise<void> {}

  onError(error: Error): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
