import orquestrator from "../../../../orchestrator";
import type { MigrationResponse } from "../../../../../types/types";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
});

describe("GET api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieve pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody: MigrationResponse = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
