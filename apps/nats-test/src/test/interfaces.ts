export interface TestDataPayload {
  test: string;
}

export interface TestDataResult {
  data: {
    test: string;
  };
}

export interface EnrichedTestData {
  data: {
    test: string;
    name: string;
    age: number;
    count: number;
  };
}
