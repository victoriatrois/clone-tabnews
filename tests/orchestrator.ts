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
      try {
        const response = await fetch("http://localhost:3000/api/v1/status");
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        await response.json;

      } catch (error) {
        throw error;
      }
      
    }
  }
}

export default {
  waitForAllServices,
};
