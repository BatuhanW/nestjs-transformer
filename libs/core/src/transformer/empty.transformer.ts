import { DefaultObject } from '../types';
import { BaseTransformer } from './base.transformer';

export class EmptyTransformer extends BaseTransformer {
  perform(payload: DefaultObject): DefaultObject {
    return payload;
  }
}
