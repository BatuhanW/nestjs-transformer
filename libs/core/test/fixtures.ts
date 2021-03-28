import { ValidationResult } from '@core';
import { TestEnrichedPayload, TestPayload, TestTransformedPayload } from './assets/interfaces';

export const fixtures = {
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
export const happyTransformer = {
  validate: (_payload: TestPayload): ValidationResult => {
    return { success: true };
  },
  perform: (payload: TestPayload): TestTransformedPayload => {
    return {
      transformed: payload,
    };
  },
  onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
};

export const happyEnricher = {
  validate: (_payload: TestTransformedPayload): ValidationResult => {
    return { success: true };
  },
  perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
    return {
      enriched: payload,
    };
  },
  onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
  onError: async (_error: Error): Promise<void> => {},
};

export const happyDestination = {
  perform: async (_payload: TestEnrichedPayload): Promise<void> => {},
  onSuccess: async (): Promise<void> => {},
  onError: async (_error: Error): Promise<void> => {},
};
/* eslint-enable @typescript-eslint/no-empty-function */
