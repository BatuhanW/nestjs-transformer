import { DefaultObject } from '../types';
import { BaseEnricher } from './base.enricher';

export default class EmptyEnricher extends BaseEnricher {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return payload;
  }
}
