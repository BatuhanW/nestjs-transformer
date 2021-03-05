import { Performable } from '../interfaces/performable.interface';
export type BaseAction<Payload> = Performable<Payload, Promise<void>>
