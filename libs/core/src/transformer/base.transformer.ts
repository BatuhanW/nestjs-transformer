import { Performable } from '../interfaces';

export type BaseTransformer<
  Payload,
  Result = Record<string, unknown> | Promise<Record<string, unknown>>
> = Performable<Payload, Result>
