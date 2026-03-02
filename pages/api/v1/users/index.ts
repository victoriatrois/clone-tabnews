import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const userInput = request.body;
  const newUser = await user.create(userInput);

  return response.status(201).json(newUser);
}
