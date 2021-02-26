export interface BaseTransformer {
  transform(payload: {}): Promise<{}>;
}
