import { Module } from '@nestjs/common';
import { TransformerCoreService } from './transformer-core.service';

@Module({
  providers: [TransformerCoreService],
  exports: [TransformerCoreService],
})
export class TransformerCoreModule {}
