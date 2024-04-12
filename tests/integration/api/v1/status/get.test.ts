interface DatabaseStatus {
  postgres_version: string;
  max_connections: number;
  used_connections: number;
}

interface StatusResponse {
  updated_at: string;
  dependencies: {
    database: DatabaseStatus;
  };
}

test("GET /status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody: StatusResponse = await response.json();
  const parsedUpdatedAt: string = new Date(
    responseBody.updated_at
  ).toISOString();
  const postgresVersion: string = "16.0";
  const maxConnections: number = 100;
  const usedConnections: number = 1;

  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.dependencies.database.postgres_version).toEqual(
    postgresVersion
  );
  expect(responseBody.dependencies.database.max_connections).toEqual(
    maxConnections
  );
  expect(responseBody.dependencies.database.used_connections).toEqual(
    usedConnections
  );
});
