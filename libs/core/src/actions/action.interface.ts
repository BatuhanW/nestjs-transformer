import { BaseTransformer } from '@core/transformer';
import { BaseDestination } from '@core/actions/base.destination';

export interface Action {
  name: string;
  transformer?: BaseTransformer;
  destination: BaseDestination;
}
