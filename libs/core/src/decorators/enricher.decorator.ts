import { SetMetadata } from '@nestjs/common';

export const ENRICHER_KEY = 'transformer-enricher';

interface EnricherDecoratorParams {
  handler: string;
}

export const Enricher = (params: EnricherDecoratorParams) =>
  SetMetadata<string, EnricherDecoratorParams>(ENRICHER_KEY, params);
