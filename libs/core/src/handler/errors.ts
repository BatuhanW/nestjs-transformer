import { AnyObject } from '@core';

class CommonError extends Error {
  incoming_payload: AnyObject;
  class_name: string;

  constructor(className: string, payload: AnyObject, message: string) {
    super();
    this.incoming_payload = payload;
    this.class_name = className;
    this.message = message;
    this.stack = undefined;
  }
}

export class TransformerValidationError extends CommonError {}

export class TransformerRuntimeError extends CommonError {}

export class EnricherValidationError extends CommonError {}

export class EnricherRuntimeError extends CommonError {}
