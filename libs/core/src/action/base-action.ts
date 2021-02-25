
export abstract class BaseAction {
  abstract perform(payload: {}): void | Promise<void>
}
