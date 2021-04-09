import { ValidationFailResult, ValidationResult, ValidationSuccessResult } from '@core';
import {
  TestDestTransformedPayload,
  TestEnrichedPayload,
  TestPayload,
  TestTransformedPayload,
} from './interfaces';

interface Fixtures {
  validation: {
    success: ValidationSuccessResult;
    fail: ValidationFailResult;
  };
  payload: TestPayload;
  transformed: TestTransformedPayload;
  enriched: TestEnrichedPayload;
  destTransformed: TestDestTransformedPayload;
}

export const fixtures: Fixtures = {
  validation: {
    success: { success: true },
    fail: { success: false, message: 'Validation fail!' },
  },
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
  destTransformed: {
    destTransformed: {
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
  success: {
    validate: (_payload: TestPayload): ValidationSuccessResult => {
      return fixtures.validation.success;
    },
    perform: (payload: TestPayload): TestTransformedPayload => {
      return {
        transformed: payload,
      };
    },
    onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
  fail: {
    validation: {
      validate: (_payload: TestPayload): ValidationResult => {
        return fixtures.validation.fail;
      },
      perform: (payload: TestPayload): TestTransformedPayload => {
        return {
          transformed: payload,
        };
      },
      onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
    unHandled: {
      validate: (_payload: TestPayload): ValidationResult => {
        return fixtures.validation.success;
      },
      perform: (payload: TestPayload): TestTransformedPayload => {
        (payload as any).will.transformerFail;

        return {
          transformed: payload,
        };
      },
      onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
  },
};

export const enrichers = {
  success: {
    validate: (_payload: TestTransformedPayload): ValidationResult => {
      return fixtures.validation.success;
    },
    perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
      return {
        enriched: payload,
      };
    },
    onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
  fail: {
    validation: {
      validate: (_payload: TestTransformedPayload): ValidationResult => {
        return fixtures.validation.fail;
      },
      perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
        return {
          enriched: payload,
        };
      },
      onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
    unHandled: {
      validate: (_payload: TestTransformedPayload): ValidationResult => {
        return fixtures.validation.success;
      },
      perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
        (payload as any).will.enricherFail;

        return {
          enriched: payload,
        };
      },
      onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
  },
};

export const destinationTransformers = {
  success: {
    validate: (_payload: TestPayload): ValidationSuccessResult => {
      return fixtures.validation.success;
    },
    perform: (payload: TestPayload): TestTransformedPayload => {
      return {
        transformed: payload,
      };
    },
    onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
  fail: {
    validation: {
      validate: (_payload: TestPayload): ValidationResult => {
        return fixtures.validation.fail;
      },
      perform: (payload: TestPayload): TestTransformedPayload => {
        return {
          transformed: payload,
        };
      },
      onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
    unHandled: {
      validate: (_payload: TestPayload): ValidationResult => {
        return fixtures.validation.success;
      },
      perform: (payload: TestPayload): TestTransformedPayload => {
        (payload as any).will.transformerFail;

        return {
          transformed: payload,
        };
      },
      onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
  },
};

export const destinations = {
  success: {
    perform: async (_payload: TestEnrichedPayload): Promise<void> => {},
    onSuccess: async (): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
  fail: {
    perform: async (payload: TestEnrichedPayload): Promise<void> => {
      (payload as any).will.destinationFail;
    },
    onSuccess: async (): Promise<void> => {},
    onError: async (_error: Error): Promise<void> => {},
  },
};

/* eslint-enable @typescript-eslint/no-empty-function */
