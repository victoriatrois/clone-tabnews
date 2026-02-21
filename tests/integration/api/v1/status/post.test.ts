import orquestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("POST api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieve system's curent state", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "This endpoint does not allow requests of the attempted type",
        action: "Check the API documentation for a valid method.",
        status_code: 405,
      });
    });
  });
});
