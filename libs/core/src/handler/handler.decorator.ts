import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const HANDLER_KEY = 'transformer-handler';

export const Handler = (): CustomDecorator<typeof HANDLER_KEY> =>
  SetMetadata<typeof HANDLER_KEY>(HANDLER_KEY, true);
