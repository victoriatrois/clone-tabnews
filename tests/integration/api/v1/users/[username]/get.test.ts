import { version as uuidVersion } from "uuid";
import orquestrator from "../../../../../orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
  await orquestrator.applyPendingMigrations();
});

describe("GET api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const createdUser = await orquestrator.createUser({
        username: "ExactMatch",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/ExactMatch",
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "ExactMatch",
        email: `${createdUser.email}`,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createdUser = await orquestrator.createUser({
        username: "CaseMismatch",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/casemismatch",
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseMismatch",
        email: `${createdUser.email}`,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
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
