test("GET /status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody: StatusResponse = await response.json();
  const parsedUpdatedAt: string = new Date(
    responseBody.updated_at
  ).toISOString();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const postgresVersion: string = "16.0";
  expect(responseBody.dependencies.database.postgres_version).toEqual(
    postgresVersion
  );

  const maxConnections: number = 100;
  expect(responseBody.dependencies.database.max_connections).toEqual(
    maxConnections
  );

  const usedConnections: number = 1;
  expect(responseBody.dependencies.database.used_connections).toEqual(
    usedConnections
  );
});
