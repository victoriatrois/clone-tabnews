import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices(): Promise<void> {
  await waitForWebServices();

  async function waitForWebServices(): Promise<void> {
    return retry(fetchStatusPage, {
      retries: 1000,
      minTimeout: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(): Promise<void> {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await response.json;
    }
  }
}
async function resetDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

const orchestrator = {
  waitForAllServices,
  resetDatabase,
};

export default orchestrator;
