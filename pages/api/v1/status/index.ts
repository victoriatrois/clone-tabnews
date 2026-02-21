import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "pg";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);

export default router.handler(controller.errorHandler);

async function getHandler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const updatedAt: string = new Date().toISOString();

  const databaseVersionQueryResult: QueryResult = await database.query({
    text: "SHOW server_version;",
  });
  const databaseVersion: string =
    databaseVersionQueryResult.rows[0].server_version;

  const maxConnectionsQueryResult: QueryResult = await database.query({
    text: "SHOW max_connections;",
  });

  const maxConnections: number = Number(
    maxConnectionsQueryResult.rows[0].max_connections,
  );

  const databaseName: string = process.env.POSTGRES_DB!;
  if (!databaseName) {
    throw new Error("POSTGRES_DB environment variable is not set");
  }

  const openedConnectionsQueryResult: QueryResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections: number = parseInt(
    openedConnectionsQueryResult.rows[0].count,
  );
  if (isNaN(openedConnections)) {
    throw new Error("Failed to parse opened connections count");
  }

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: databaseVersion,
        max_connections: maxConnections,
        used_connections: openedConnections,
      },
    },
  });
}
