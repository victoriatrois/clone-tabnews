export class InternalServerError extends Error {
  action: string;
  statusCode: number;

  constructor({ cause, statusCode }: { cause?: unknown; statusCode: number }) {
    super("An unexpected internal error happened", { cause });
    this.name = "InternalServerError";
    this.action = "Something went wrong, contact support.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class MethodNotAllowedError extends Error {
  action: string;
  statusCode: number;

  constructor() {
    super("This endpoint does not allow requests of the attempted type");
    this.name = "MethodNotAllowedError";
    this.action = "Check the API documentation for a valid method.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  action: string;
  statusCode: number;

  constructor({
    action,
    cause,
    statusCode,
    message,
  }: {
    action?: string;
    cause?: unknown;
    statusCode: number;
    message: string;
  }) {
    super(message || "Service unavailable", { cause });
    this.name = "InternalServerError";
    this.action = action || "Something went wrong, check service availability.";
    this.statusCode = statusCode || 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MissingEnvironmentVariableError extends Error {
  action: string;
  statusCode: number;

  constructor({ variable }: { variable: string }) {
    super(`${variable} environment variable is not set`);
    this.name = "MissingEnvironmentVariableError";
    this.action = "Configure the required environment variable.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
