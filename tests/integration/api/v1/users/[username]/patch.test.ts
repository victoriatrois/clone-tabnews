import { version as uuidVersion } from "uuid";
import orquestrator from "../../../../../orchestrator";
import user from "../../../../../../models/user";
import password from "../../../../../../models/password";
import orchestrator from "../../../../../orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
  await orquestrator.applyPendingMigrations();
});

describe("PATCH api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With a non-existing 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/nonExistingUser",
        {
          method: "PATCH",
        },
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

    test("With duplicated 'username' data", async () => {
      await orquestrator.createUser({
        username: "user1",
      });

      await orquestrator.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The informed username has already been used",
        action: "Use a different username in this opperation.",
        status_code: 400,
      });
    });

    test("With unique 'username' data", async () => {
      const createdUser = await orchestrator.createUser({
        username: "uniqueUser1",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueUser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: createdUser.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With duplicated 'email' data", async () => {
      await orquestrator.createUser({
        email: "duplicatedEmail1@gmail.com",
      });

      const secondlyCreatedUser = await orquestrator.createUser({
        email: "duplicatedEmail2@gmail.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${secondlyCreatedUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "duplicatedEmail1@gmail.com",
          }),
        },
      );
      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The informed email address has already been used",
        action: "Use a different email address in this operation.",
        status_code: 400,
      });
    });

    test("With unique 'email' data", async () => {
      const createdUser = await orquestrator.createUser({
        email: "uniqueEmail@gmail.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueEmail2@gmail.com",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createdUser.username,
        email: "uniqueEmail2@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("With new 'password' data", async () => {
      const createdUser = await orquestrator.createUser({
        password: "senha123",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: `${createdUser.username}`,
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const persistedUser = await user.findOneByUsername(
        `${createdUser.username}`,
      );
      const passwordsMatch = await password.compare(
        "newPassword2",
        persistedUser.password,
      );
      const passwordsDontMatch = await password.compare(
        "newPassword1",
        persistedUser.password,
      );

      expect(passwordsMatch).toBe(true);
      expect(passwordsDontMatch).toBe(false);
    });
  });
});
