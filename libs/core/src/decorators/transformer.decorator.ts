import { SetMetadata } from '@nestjs/common';

export const TRANSFORMER_KEY = 'transformer-transformer';
interface TransformerDecoratorParams {
  handler: Function;
}

export const Transformer = (params: TransformerDecoratorParams) =>
  SetMetadata<string, TransformerDecoratorParams>(TRANSFORMER_KEY, params);
