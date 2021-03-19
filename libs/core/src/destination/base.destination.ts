import { Performable } from '../interfaces';

export type BaseDestination<Payload> = Performable<Payload, Promise<void>>;
