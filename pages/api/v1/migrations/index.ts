import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { resolve } from "path";
import database from "../../../../infra/database";
import { Client } from "pg";

export default async function migrations(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const allowedMethods: string[] = ["GET", "POST"];
  let dbClient: Client;
  const databaseUrl: string = process.env.DATABASE_URL || "";

  if (request.method && !allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed.`,
    });
  }

  dbClient = await database.createDbClient();
  const defaultMigrationOptions: RunnerOption = {
    dbClient: dbClient,
    databaseUrl: databaseUrl as string,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  try {
    if (!databaseUrl) {
      response
        .status(500)
        .json({ error: "DATABASE_URL environment variable is not set" });
      return;
    }

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const completedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (completedMigrations.length > 0) {
        return response.status(201).json(completedMigrations);
      }

      return response.status(200).json(completedMigrations);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
