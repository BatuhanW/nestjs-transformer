import { ValidationResult, ValidationSuccessResult } from '@core';
import { TestEnrichedPayload, TestPayload, TestTransformedPayload } from './interfaces';

interface Fixtures {
  happy: {
    validation: ValidationSuccessResult;
    payload: TestPayload;
    transformed: TestTransformedPayload;
    enriched: TestEnrichedPayload;
  };
}

export const fixtures: Fixtures = {
  happy: {
    validation: { success: true },
    payload: {
      because: "I don't know",
      imTest: true,
    },
    transformed: {
      transformed: {
        because: "I don't know",
        imTest: true,
      },
    },
    enriched: {
      enriched: {
        transformed: {
          because: "I don't know",
          imTest: true,
        },
      },
    },
  },
};

/* eslint-disable @typescript-eslint/no-empty-function */

export const transformers = {
  happy: {
    validate: (_payload: TestPayload): ValidationResult => {
      return fixtures.happy.validation;
    },
    perform: (payload: TestPayload): TestTransformedPayload => {
      return {
        transformed: payload,
      };
    },
    onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
  },
};

export const enrichers = {
  happy: {
    validate: (_payload: TestTransformedPayload): ValidationResult => {
      return fixtures.happy.validation;
    },
    perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
      return {
        enriched: payload,
      };
    },
    onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
};

export const destinations = {
  happy: {
    perform: async (_payload: TestEnrichedPayload): Promise<void> => {},
    onSuccess: async (): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
};
/* eslint-enable @typescript-eslint/no-empty-function */
