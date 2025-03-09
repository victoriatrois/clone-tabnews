import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join } from "path";
import database from "../../../../infra/database";

export default async function getMigrations(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const dbClient = await database.createDbClient();
  const databaseUrl = process.env.DATABASE_URL;

  const defaultMigrationOptions = {
    dbClient: dbClient,
    databaseUrl: databaseUrl as string,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  } as RunnerOption;

  try {
    if (!databaseUrl) {
      response
        .status(500)
        .json({ error: "DATABASE_URL environment variable is not set" });
      return;
    }

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      await dbClient.end();

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const completedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      await dbClient.end();

      if (completedMigrations.length > 0) {
        return response.status(201).json(completedMigrations);
      }

      return response.status(200).json(completedMigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(405).json({ error: "Method not allowed." });
  }
}
