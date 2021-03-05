import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const TRANSFORMER_KEY = 'transformer-transformer';
export interface TransformerDecoratorParams {
  handlers: string[];
}

export const Transformer = (params: TransformerDecoratorParams): CustomDecorator<typeof TRANSFORMER_KEY> =>
  SetMetadata<typeof TRANSFORMER_KEY, TransformerDecoratorParams>(TRANSFORMER_KEY, params);
