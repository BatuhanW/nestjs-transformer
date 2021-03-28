export interface TestPayload {
  because: string;
  imTest: boolean;
}

export interface TestTransformedPayload {
  transformed: TestPayload;
}

export interface TestEnrichedPayload {
  enriched: TestTransformedPayload;
}
