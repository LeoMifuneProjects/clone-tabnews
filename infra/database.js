import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}
export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTEGRES_CA) {
    return {
      ca: process.env.POSTGRESS_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
