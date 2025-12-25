import { StatusResponse } from "types/types";
import orquestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("GET api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieve system's curent state", async () => {
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
  });
});
