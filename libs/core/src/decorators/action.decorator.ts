import { SetMetadata } from '@nestjs/common';

export const ACTION_KEY = 'transformer-action';

export interface ActionDecoratorParams {
  handlers: string[];
}

export const Action = (params: ActionDecoratorParams) =>
  SetMetadata<string, ActionDecoratorParams>(ACTION_KEY, params);
