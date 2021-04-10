import { AnyObject, ValidationFailResult, ValidationResult, ValidationSuccessResult } from '@core';
import { TestEnrichedPayload, TestPayload, TestTransformedPayload } from './interfaces';

interface Fixtures {
  validation: {
    success: ValidationSuccessResult;
    fail: ValidationFailResult;
  };
  payload: TestPayload;
  transformed: TestTransformedPayload;
  enriched: TestEnrichedPayload;
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
    perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
      return {
        enriched: payload,
      };
    },
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
    },
    unHandled: {
      perform: async (payload: TestTransformedPayload): Promise<TestEnrichedPayload> => {
        (payload as any).will.enricherFail;

        return {
          enriched: payload,
        };
      },
    },
  },
};

export const destinations = {
  withHooks: {
    success: {
      withPerformResult: {
        perform: async (payload: TestEnrichedPayload): Promise<AnyObject> => {
          return payload;
        },
        onSuccess: async (_payload?: AnyObject): Promise<void> => {},
      },
      withoutPerformResult: {
        perform: async (_payload: TestEnrichedPayload): Promise<void> => {},
        onSuccess: async (_payload?: AnyObject): Promise<void> => {},
      },
    },
    fail: {
      perform: async (payload: TestEnrichedPayload): Promise<void> => {
        (payload as any).will.destinationFail;
      },
      onError: async (_error: Error): Promise<void> => {},
      onSuccess: async (_payload?: AnyObject): Promise<void> => {},
    },
  },
  withoutHooks: {
    success: {
      perform: async (_payload: TestEnrichedPayload): Promise<void> => {},
    },
    fail: {
      perform: async (payload: TestEnrichedPayload): Promise<void> => {
        (payload as any).will.destinationFail;
      },
    },
  },
};

/* eslint-enable @typescript-eslint/no-empty-function */
