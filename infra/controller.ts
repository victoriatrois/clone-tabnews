import { InternalServerError, MethodNotAllowedError, ValidationError } from "infra/errors";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

function onNoMatchHandler(request: NextApiRequest, response: NextApiResponse) {
  const publicError: MethodNotAllowedError = new MethodNotAllowedError();
  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(
  error: unknown,
  request: NextApiRequest,
  response: NextApiResponse,
) {

  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    statusCode: (error as any)?.statusCode,
    cause: error,
  });
  console.error(publicError);
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandler: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
