export class ServerError extends Error {
  //... calls to super and all that jazz
  public name: string

  constructor(public code: number, public message: string) {
    super(message);
    //Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

export class NotImplementedError extends Error {
  public name: string = "NotImplementedError"
  public message: string
  constructor(message?: string) {
    super(message);
    //Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends ServerError {
  public message: string

  constructor(message?: string) {
    super(401, message);
    //Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ServerError {
  public message: string

  constructor(message?: string) {
    super(400, message);
    //Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ServerError {
  public message: string

  constructor(message?: string) {
    super(404, message);
    //Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ServerError {
  public message: string

  constructor(message?: string) {
    super(422, message);
    //Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends ServerError {
  public message: string

  constructor(message?: string) {
    super(500, message);
    //Error.captureStackTrace(this, this.constructor);
  }
}
