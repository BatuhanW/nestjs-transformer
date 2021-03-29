import { Module } from '@nestjs/common';
import { AmplitudeDestination } from './destinations/amplitude.destination';
import { BrazeDestination } from './destinations/braze.destination';

@Module({
  providers: [AmplitudeDestination, BrazeDestination],
  exports: [AmplitudeDestination, BrazeDestination],
})
export class CommonModule {}
