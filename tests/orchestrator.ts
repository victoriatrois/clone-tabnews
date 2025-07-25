import retry from "async-retry";

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
      const responseBody = await response.json();
    }
  }
}

export default {
  waitForAllServices,
};
