import { DefaultObject } from '../types';

export abstract class BaseDestination<Payload = DefaultObject> {
  abstract perform(payload: Payload): void | Promise<void>;

  // eslint-disable-next-line
  onSuccess(): void | Promise<void> {}
}
