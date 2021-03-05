export interface Performable<
  Payload = Record<string, unknown>,
  Result = unknown
> {
  perform(payload: Payload, ...deps: any[]): Result;
}
