import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { resolve } from "path";
import database from "../../../../infra/database";
import { Client } from "pg";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

let dbClient: Client;

const databaseUrl: string = process.env.DATABASE_URL || "";
const defaultMigrationOptions: RunnerOption = {
  databaseUrl: databaseUrl as string,
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  dbClient = await database.createDbClient();

  try {
    if (!databaseUrl) {
      response
        .status(500)
        .json({ error: "DATABASE_URL environment variable is not set" });
      return;
    }

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  // let dbClient: Client;
  // const databaseUrl: string = process.env.DATABASE_URL || "";

  dbClient = await database.createDbClient();

  try {
    if (!databaseUrl) {
      response
        .status(500)
        .json({ error: "DATABASE_URL environment variable is not set" });
      return;
    }

    const completedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });

    if (completedMigrations.length > 0) {
      return response.status(201).json(completedMigrations);
    }

    return response.status(200).json(completedMigrations);
  } finally {
    await dbClient.end();
  }
}
