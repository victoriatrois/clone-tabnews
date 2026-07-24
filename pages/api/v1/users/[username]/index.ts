import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import controller from "../../../../../infra/controller";
import user from "../../../../../models/user";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandler);

async function getHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const username = request.query.username as string;
  const returnedUser = await user.findOneByUsername(username);
  return response.status(200).json(returnedUser);
}

async function patchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const username = request.query.username as string;
  const userInput = request.body;

  const updatedUser = await user.update(username, userInput);

  return response.status(200).json(updatedUser);
}
