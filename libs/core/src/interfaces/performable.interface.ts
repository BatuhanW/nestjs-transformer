export interface Performable<Payload, Result> {
  perform(payload: Payload): Result;
}
