interface ValidationSuccessResult {
  success: true;
}

interface ValidationFailResult {
  success: false;
  message: string;
}

export type ValidationResult = ValidationSuccessResult | ValidationFailResult;
