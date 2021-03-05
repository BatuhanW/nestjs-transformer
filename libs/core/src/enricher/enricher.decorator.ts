import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ENRICHER_KEY = 'transformer-enricher';

export interface EnricherDecoratorParams {
  handlers: string[];
}

export const Enricher = (
  params: EnricherDecoratorParams,
): CustomDecorator<typeof ENRICHER_KEY> =>
  SetMetadata<typeof ENRICHER_KEY, EnricherDecoratorParams>(
    ENRICHER_KEY,
    params,
  );
