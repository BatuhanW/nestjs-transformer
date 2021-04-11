export interface TestPayload {
  because: string;
  imTest: boolean;
}

export interface TestEnrichedPayload {
  enriched: TestPayload;
}

export interface TestTransformedPayload {
  transformed: TestEnrichedPayload;
}

export interface TestPlainTransformedPayload {
  transformed: TestPayload;
}

export interface TestDestTransformedPayload {
  destTransformed: TestEnrichedPayload;
}
