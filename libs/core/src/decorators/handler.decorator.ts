import { SetMetadata } from '@nestjs/common';

export const HANDLER_KEY = 'transformer-handler';

interface HandlerDecoratorParams {
  handler: string;
}

export const Handler = (params: HandlerDecoratorParams) =>
  SetMetadata<string, HandlerDecoratorParams>(HANDLER_KEY, params);
