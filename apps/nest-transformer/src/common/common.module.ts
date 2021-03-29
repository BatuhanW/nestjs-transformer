import { HttpModule, Module } from '@nestjs/common';
import { AmplitudeDestination } from './destinations/amplitude.destination';
import { BrazeDestination } from './destinations/braze.destination';
import { UserEnricher } from './enrichers/user.enricher';

@Module({
  imports: [HttpModule],
  providers: [UserEnricher, AmplitudeDestination, BrazeDestination],
  exports: [UserEnricher, AmplitudeDestination, BrazeDestination],
})
export class CommonModule {}
