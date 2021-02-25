export interface BaseAction {
  perform(payload: {}): void | Promise<void>;
}
