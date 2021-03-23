import { DefaultObject } from '../types';

export abstract class BaseDestination<Payload = DefaultObject> {
  abstract perform(payload: Payload): Promise<void>;

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
