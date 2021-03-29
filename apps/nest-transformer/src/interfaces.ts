export interface TestDataPayload {
  test: string;
  test2: {
    test3: string;
  };
}

export interface TestDataResult {
  data: TestDataPayload;
}

export interface EnrichedTestData {
  data: {
    test: string;
    test2: {
      test3: string;
    };
    name: string;
    age: number;
    count: number;
  };
}
