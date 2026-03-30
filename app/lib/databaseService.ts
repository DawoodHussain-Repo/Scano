import { DataAPIClient } from "@datastax/astra-db-ts";

if (!process.env.ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("ASTRA_DB_APPLICATION_TOKEN is required");
}

if (!process.env.ASTRA_DB_API_ENDPOINT) {
  throw new Error("ASTRA_DB_API_ENDPOINT is required");
}

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);

export const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
  keyspace: "default_keyspace",
});

export const COLLECTION_NAME = "contract_documents";
