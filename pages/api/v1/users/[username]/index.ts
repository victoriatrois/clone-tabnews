import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const username = request.query.username as string;
  const returnedUser = await user.findOneByUsername(username);
  return response.status(200).json(returnedUser);
}
