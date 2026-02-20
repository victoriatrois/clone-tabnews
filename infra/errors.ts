export class InternalServerError extends Error {
  action: string;
  statusCode: number;

  constructor({ cause }: { cause?: unknown }) {
    super("An unexpected internal error happened", { cause });
    this.name = "InternalServerError";
    this.action = "Something went wrong, contact support.";
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
