export interface HappyPayload {
  because: string;
  imHappy: boolean;
}

export interface HappyTransformedPayload {
  transformed: HappyPayload;
}

export interface HappyEnrichedPayload {
  enriched: HappyTransformedPayload;
}
