import { version as uuidVersion } from "uuid";
import orquestrator from "tests/orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
  await orquestrator.applyPendingMigrations();
});

describe("GET api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "ExactMatch",
          email: "exact.match@gmail.com",
          password: "senha123",
        }),
      });
      expect(firstResponse.status).toBe(201);

      const secondResponse = await fetch(
        "http://localhost:3000/api/v1/users/ExactMatch",
      );
      expect(secondResponse.status).toBe(200);

      const secondResponseBody = await secondResponse.json();
      expect(secondResponseBody).toEqual({
        id: secondResponseBody.id,
        username: "ExactMatch",
        email: "exact.match@gmail.com",
        password: "senha123",
        created_at: secondResponseBody.created_at,
        updated_at: secondResponseBody.updated_at,
      });
      expect(uuidVersion(secondResponseBody.id)).toBe(4);
      expect(Date.parse(secondResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(secondResponseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseMismatch",
          email: "case.mismatch@gmail.com",
          password: "senha123",
        }),
      });
      expect(firstResponse.status).toBe(201);

      const secondResponse = await fetch(
        "http://localhost:3000/api/v1/users/casemismatch",
      );
      expect(secondResponse.status).toBe(200);

      const secondResponseBody = await secondResponse.json();
      expect(secondResponseBody).toEqual({
        id: secondResponseBody.id,
        username: "CaseMismatch",
        email: "case.mismatch@gmail.com",
        password: "senha123",
        created_at: secondResponseBody.created_at,
        updated_at: secondResponseBody.updated_at,
      });
      expect(uuidVersion(secondResponseBody.id)).toBe(4);
      expect(Date.parse(secondResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(secondResponseBody.updated_at)).not.toBeNaN();
    });

    test("With a non-existing user", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/nonExistingUser",
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "The informed user was not found",
        action: "Check the if the username is correct.",
        status_code: 404,
      });
    });
  });
});
