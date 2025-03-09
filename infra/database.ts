import { Client, QueryConfig } from "pg";

async function query(queryObject: QueryConfig): Promise<any> {
  let client: Client | undefined;

  try {
    client = await createDbClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function createDbClient(): Promise<Client> {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSslValues(),
  });

  await client.connect();

  return client;
}

export default {
  query,
  createDbClient,
};

function getSslValues(): boolean | { ca: string } {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
