import { BaseTransformer } from '@core/transformer';
import { BaseDestination } from '@core/actions/base.destination';

export interface Action {
  transformer?: BaseTransformer;
  destination: BaseDestination;
}
