import { SetMetadata } from '@nestjs/common';

export const ACTION_KEY = 'transformer-action';

interface ActionDecoratorParams {
  handler: Function;
}

export const Action = (params: ActionDecoratorParams) =>
  SetMetadata<string, ActionDecoratorParams>(ACTION_KEY, params);
