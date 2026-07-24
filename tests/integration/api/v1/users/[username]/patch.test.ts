import { version as uuidVersion } from "uuid";
import orquestrator from "../../../../../orchestrator";
import user from "../../../../../../models/user";
import password from "../../../../../../models/password";

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
      const firstUserResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user1",
            email: "user1@gmail.com",
            password: "senha123",
          }),
        },
      );
      expect(firstUserResponse.status).toBe(201);

      const secondUserResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user2",
            email: "user2@gmail.com",
            password: "senha123",
          }),
        },
      );
      expect(secondUserResponse.status).toBe(201);

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
      const userResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser1",
          email: "uniqueUser@gmail.com",
          password: "senha123",
        }),
      });
      expect(userResponse.status).toBe(201);

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
        email: "uniqueUser@gmail.com",
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
      const firstUserResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "duplicatedEmail1",
            email: "duplicatedEmail1@gmail.com",
            password: "senha123",
          }),
        },
      );
      expect(firstUserResponse.status).toBe(201);

      const secondUserResponse = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "duplicatedEmail2",
            email: "duplicatedEmail2@gmail.com",
            password: "senha123",
          }),
        },
      );
      expect(secondUserResponse.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/duplicatedEmail2",
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
      const userResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueEmailUser1",
          email: "uniqueEmail@gmail.com",
          password: "senha123",
        }),
      });
      expect(userResponse.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueEmailUser1",
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
        username: "uniqueEmailUser1",
        email: "uniqueEmail2@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new 'password' data", async () => {
      const userResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword1",
          email: "newPassword1@gmail.com",
          password: "senha123",
        }),
      });
      expect(userResponse.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/newPassword1",
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
        username: "newPassword1",
        email: "newPassword1@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const persistedUser = await user.findOneByUsername("newPassword1");
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
