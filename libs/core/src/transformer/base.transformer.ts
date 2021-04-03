import { DefaultObject, ValidationResult } from '../types';
import { CorePerformable } from '../core.performable';

export abstract class BaseTransformer<
  Payload = DefaultObject,
  Result = DefaultObject
> extends CorePerformable<Payload, Result> {}
