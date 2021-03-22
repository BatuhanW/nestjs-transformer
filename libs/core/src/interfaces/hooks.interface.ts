export interface onHandlerStart {
  onHandlerStart<Payload = Record<string, any>>(payload: Payload): void;
  onHandlerStart<Payload = Record<string, any>>(payload: Payload): Promise<void>;
}

export interface onHandlerEnd {
  onHandlerEnd<Result = Record<string, any>>(result: Result): void;
  onHandlerEnd<Result = Record<string, any>>(result: Result): Promise<void>;
}

export interface onPerformableStart {
  onPerformableStart<Payload = Record<string, any>>(payload: Payload): void;
  onPerformableStart<Payload = Record<string, any>>(payload: Payload): Promise<void>;
}

export interface onPerformableEnd {
  onPerformableEnd<Result = Record<string, any>>(result: Result): void;
  onPerformableEnd<Result = Record<string, any>>(result: Result): Promise<void>;
}

export interface onHandlerError {
  onHandlerError(error: Error): void | Promise<void>;
}

export interface onHandlerSuccess {
  onSuccess<Payload>(payload: Payload): void;
  onSuccess<Payload>(payload: Payload): Promise<void>;
}
