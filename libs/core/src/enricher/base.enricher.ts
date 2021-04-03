import { DefaultObject } from '@core';
import { CorePerformable } from '../core.performable';

export abstract class BaseEnricher<
  Payload = DefaultObject,
  Result = DefaultObject
> extends CorePerformable<Payload, Result> {}
