export interface OnHandlerStart {
  onHandlerStart<Payload>(payload: Payload): any;
}

export interface OnHandlerEnd {
  onHandlerEnd(): any;
}

export interface OnPerformableStart {
  onPerformableStart(): any;
}

export interface OnPerformableEnd {
  onPerformableEnd(): any;
}

export interface OnError {
  onError(e: Error): void;
}

export interface OnSuccess {
  onSuccess<Payload>(payload: Payload): void;
}
