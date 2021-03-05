import { Performable } from '../interfaces/performable.interface';
export type BaseEnricher<
  Payload = Record<string, unknown>,
  Result = Promise<Record<string, unknown>>
> = Performable<Payload, Result>;
