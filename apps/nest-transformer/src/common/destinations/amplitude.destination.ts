import { Injectable } from '@nestjs/common';
import { BaseDestination } from '@core';
import { AmplitudePayload } from '../../interfaces';

@Injectable()
export class AmplitudeDestination extends BaseDestination<AmplitudePayload> {
  async perform(payload: AmplitudePayload): Promise<void> {
    console.log(`[${this.constructor.name}] perform triggered with payload`, {
      ...payload,
    });
  }

  onSuccess(): void {
    console.log(`[${this.constructor.name}] Success!`);
  }
}
