// function transform(payload: {}): {}
// function transform(payload: {}): Promise<{}>

export abstract class BaseTransformer {
  abstract transform(payload: {}): {} | Promise<{}>;
}
