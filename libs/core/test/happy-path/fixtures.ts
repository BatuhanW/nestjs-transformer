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

export const emptyTransformer = {
  validate: (_payload: HappyPayload): ValidationResult => {
    return { success: true };
  },
  perform: (payload: HappyPayload): HappyTransformedPayload => {
    return {
      transformed: payload,
    };
  },
  onSuccess: (_payload: HappyTransformedPayload): void => {},
};

export const emptyEnricher = {
  validate: (_payload: HappyTransformedPayload): ValidationResult => {
    return { success: true };
  },
  perform: async (payload: HappyTransformedPayload): Promise<HappyEnrichedPayload> => {
    return {
      enriched: payload,
    };
  },
  onSuccess: (_payload: HappyEnrichedPayload): void => {},
  onError: (_error: Error) => {
    console.log(_error);
  },
};
