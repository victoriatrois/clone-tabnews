import orquestrator from "../../../../orchestrator";
import type { MigrationResponse } from "../../../../../types/types";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
});

describe("POST api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Run pending migrations", () => {
      test("For the first time", async () => {
        const firstResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(firstResponse.status).toBe(201);

        const firstResponseBody: MigrationResponse = await firstResponse.json();
        expect(Array.isArray(firstResponseBody)).toBe(true);
        expect(firstResponseBody.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const secondResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(secondResponse.status).toBe(200);

        const secondResponseBody: MigrationResponse =
          await secondResponse.json();
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);
      });
    });
  });
});
