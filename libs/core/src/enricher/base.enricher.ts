import { CorePerformable } from '@core/core.performable';
import { AnyObject } from '@core';

export abstract class BaseEnricher<Payload = AnyObject, Result = AnyObject> extends CorePerformable<
  Payload,
  Result
> {}
