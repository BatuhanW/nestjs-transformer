import { ValidationResult } from '@core';
import { HappyEnrichedPayload, HappyPayload, HappyTransformedPayload } from './interfaces';

export const payloads = {
  payload: {
    because: "I don't know",
    imHappy: true,
  },
  transformed: {
    transformed: {
      because: "I don't know",
      imHappy: true,
    },
  },
  enriched: {
    enriched: {
      transformed: {
        because: "I don't know",
        imHappy: true,
      },
    },
  },
};

export const happyTransformer = {
  validate: (_payload: HappyPayload): ValidationResult => {
    return { success: true };
  },
  perform: (payload: HappyPayload): HappyTransformedPayload => {
    return {
      transformed: payload,
    };
  },
  onSuccess: async (_payload: HappyTransformedPayload): Promise<void> => {},
};

export const happyEnricher = {
  validate: (_payload: HappyTransformedPayload): ValidationResult => {
    return { success: true };
  },
  perform: async (payload: HappyTransformedPayload): Promise<HappyEnrichedPayload> => {
    return {
      enriched: payload,
    };
  },
  onSuccess: async (_payload: HappyEnrichedPayload): Promise<void> => {},
  onError: async (_error: Error) => {},
};

export const happyDestination = {
  perform: async (_payload: HappyEnrichedPayload): Promise<void> => {},
  onSuccess: async (): Promise<void> => {},
};
