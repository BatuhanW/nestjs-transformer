import { CorePerformable } from '@core/core.performable';
import { AnyObject } from '@core';

export abstract class BaseTransformer<
  Payload = AnyObject,
  Result = AnyObject
> extends CorePerformable<Payload, Result> {}
