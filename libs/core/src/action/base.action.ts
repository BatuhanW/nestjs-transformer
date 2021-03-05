import { Performable } from '../interfaces';

export type BaseAction<Payload> = Performable<Payload, Promise<void>>;
