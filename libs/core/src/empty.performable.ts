import { CorePerformable } from '@core/core.performable';
import { DefaultObject } from '@core/interfaces';

export class EmptyPerformable extends CorePerformable {
  async perform(payload: DefaultObject): Promise<DefaultObject> {
    return payload;
  }
}
