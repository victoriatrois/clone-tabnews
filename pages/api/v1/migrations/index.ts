import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const completedMigrations = await migrator.applyPendingMigrations();

  if (completedMigrations.length > 0) {
    return response.status(201).json(completedMigrations);
  }

  return response.status(200).json(completedMigrations);
}
