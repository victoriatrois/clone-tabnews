import database from "../../../../../infra/database";

async function resetDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

beforeAll(resetDatabase);

test("GET /migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody: MigrationResponse = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
