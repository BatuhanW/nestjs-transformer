import { SetMetadata } from '@nestjs/common';

export const ENRICHER_KEY = 'transformer-enricher';

export interface EnricherDecoratorParams {
  handler: string;
}

export const Enricher = (params: EnricherDecoratorParams) =>
  SetMetadata<string, EnricherDecoratorParams>(ENRICHER_KEY, params);
