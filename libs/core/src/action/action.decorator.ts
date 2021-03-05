import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ACTION_KEY = 'transformer-action';

export interface ActionDecoratorParams {
  handlers: string[];
}

export const Action = (
  params: ActionDecoratorParams,
): CustomDecorator<typeof ACTION_KEY> =>
  SetMetadata<typeof ACTION_KEY, ActionDecoratorParams>(ACTION_KEY, params);
