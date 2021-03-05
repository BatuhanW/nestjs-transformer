import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const HANDLER_KEY = 'transformer-handler';

interface HandlerDecoratorParams {
  name: string;
}

export const Handler = (
  params: HandlerDecoratorParams,
): CustomDecorator<typeof HANDLER_KEY> =>
  SetMetadata<typeof HANDLER_KEY, HandlerDecoratorParams>(HANDLER_KEY, params);
