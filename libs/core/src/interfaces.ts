export type DefaultObject = Record<string, any>;

export interface ValidationSuccessResult {
  success: true;
}

export interface ValidationFailResult {
  success: false;
  message: string;
}

export type ValidationResult = ValidationSuccessResult | ValidationFailResult;
