import database from "infra/database";
import { MissingEnvironmentVariableError, ServiceError } from "infra/errors";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { RunMigration } from "node-pg-migrate/dist/migration";
import { resolve } from "path";
import { Client } from "pg";

const databaseUrl: string = process.env.DATABASE_URL || "";
const defaultMigrationOptions: RunnerOption = {
  databaseUrl: databaseUrl as string,
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

let dbClient: Client;

async function runMigrations(dryRun: boolean = true): Promise<RunMigration[]> {
  if (!databaseUrl) {
    throw new MissingEnvironmentVariableError({ variable: "DATABASE_URL" });
  }

  dbClient = await database.createDbClient();

  try {
    return await migrationRunner({
      ...defaultMigrationOptions,
      dryRun,
      dbClient,
    });
  } catch (error) {
    throw new ServiceError({
      message: `Failed to ${dryRun ? "list" : "apply"} migrations`,
      action: "Check database connection and migration files.",
      statusCode: 500,
    });
  } finally {
    await dbClient?.end();
  }
}

async function listPendingMigrations(): Promise<RunMigration[]> {
  return runMigrations();
}

async function applyPendingMigrations(): Promise<RunMigration[]> {
  return runMigrations(false);
}

const migrator = {
  listPendingMigrations,
  applyPendingMigrations,
};

export default migrator;
