import { DefaultObject } from '../types/index';

class ValidationError extends Error {
  incoming_payload: DefaultObject;
  class_name: string;

  constructor(className: string, payload: DefaultObject, message: string) {
    super();
    this.incoming_payload = payload;
    this.class_name = className;
    this.message = message;
    this.stack = undefined;
  }
}

export class TransformerValidationError extends ValidationError {}

export class EnricherValidationError extends ValidationError {}
