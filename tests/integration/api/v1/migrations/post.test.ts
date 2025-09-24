import database from "../../../../../infra/database";
import orquestrator from "../../../../orchestrator";
import type { MigrationResponse } from "../../../../../types/types";

async function resetDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await resetDatabase();
});

test("POST /migrations should return 200", async () => {
  const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(firstResponse.status).toBe(201);

  const firstResponseBody: MigrationResponse = await firstResponse.json();
  expect(Array.isArray(firstResponseBody)).toBe(true);
  expect(firstResponseBody.length).toBeGreaterThan(0);

  const secondResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(secondResponse.status).toBe(200);

  const secondResponseBody: MigrationResponse = await secondResponse.json();
  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toBe(0);
});
