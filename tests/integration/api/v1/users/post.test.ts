import { version as uuidVersion } from "uuid";
import orquestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.resetDatabase();
  await orquestrator.applyPendingMigrations();
});

describe("POST api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With valid unique data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "filipedeschamps",
          email: "fdeschaps@gmail.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
        email: "fdeschaps@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated 'email' data", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail1",
          email: "duplicatedemail@gmail.com",
          password: "senha123",
        }),
      });
      expect(firstResponse.status).toBe(201);

      const secondResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedemail2",
          email: "duplicatedemail@gmail.com",
          password: "senha123",
        }),
      });
      expect(secondResponse.status).toBe(400);

      const secondResponseBody = await secondResponse.json();
      expect(secondResponseBody).toEqual({
        name: "ValidationError",
        message: "The informed email address has already signed up",
        action: "Use a different email address to sign up.",
        status_code: 400,
      });
    });

    test("With duplicated 'username' data", async () => {
      const firstResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicatedusername",
          email: "duplicatedusername1@gmail.com",
          password: "senha123",
        }),
      });
      expect(firstResponse.status).toBe(201);

      const secondResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Duplicatedusername",
          email: "duplicatedemail2@gmail.com",
          password: "senha123",
        }),
      });
      expect(secondResponse.status).toBe(400);

      const secondResponseBody = await secondResponse.json();
      expect(secondResponseBody).toEqual({
        name: "ValidationError",
        message: "The informed username has already signed up",
        action: "Use a different username to sign up.",
        status_code: 400,
      });
    });
  });
});
