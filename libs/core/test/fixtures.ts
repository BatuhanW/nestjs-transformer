import { AnyObject, ValidationFailResult, ValidationResult, ValidationSuccessResult } from '@core';
import {
  TestEnrichedPayload,
  TestPayload,
  TestPlainTransformedPayload,
  TestTransformedPayload,
} from './interfaces';

interface Fixtures {
  validation: {
    success: ValidationSuccessResult;
    fail: ValidationFailResult;
  };
  payload: TestPayload;
  enriched: TestEnrichedPayload;
  transformed: TestTransformedPayload;
  plainTransformed: TestPlainTransformedPayload;
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
  enriched: {
    enriched: {
      because: "I don't know",
      imTest: true,
    },
  },
  transformed: {
    transformed: {
      enriched: {
        because: "I don't know",
        imTest: true,
      },
    },
  },
  plainTransformed: {
    transformed: {
      because: "I don't know",
      imTest: true,
    },
  },
};

/* eslint-disable @typescript-eslint/no-empty-function */

export const enrichers = {
  success: {
    validate: (_payload: TestPayload): ValidationSuccessResult => {
      return fixtures.validation.success;
    },
    perform: (payload: TestPayload): TestEnrichedPayload => {
      return {
        enriched: payload,
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
      perform: (payload: TestPayload): TestEnrichedPayload => {
        return {
          enriched: payload,
        };
      },
      onSuccess: async (_payload: TestEnrichedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
    unHandled: {
      validate: (_payload: TestPayload): ValidationResult => {
        return fixtures.validation.success;
      },
      perform: (payload: TestPayload): TestEnrichedPayload => {
        (payload as any).will.transformerFail;

        return {
          enriched: payload,
        };
      },
      onSuccess: async (_payload: TestTransformedPayload): Promise<void> => {},
      onError: async (_error: Error): Promise<void> => {},
    },
  },
};

export const transformers = {
  success: {
    perform: async (payload: TestEnrichedPayload): Promise<TestTransformedPayload> => {
      return {
        transformed: payload,
      };
    },
  },
  fail: {
    validation: {
      validate: (_payload: TestEnrichedPayload): ValidationResult => {
        return fixtures.validation.fail;
      },
      perform: async (payload: TestEnrichedPayload): Promise<TestTransformedPayload> => {
        return {
          transformed: payload,
        };
      },
    },
    unHandled: {
      perform: async (payload: TestEnrichedPayload): Promise<TestTransformedPayload> => {
        (payload as any).will.enricherFail;

        return {
          transformed: payload,
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
