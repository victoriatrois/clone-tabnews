import useSWR from "swr";
import { StatusResponse } from "types/types";

async function fetchEndpoint(endpointURL: string): Promise<StatusResponse> {
  const response = await fetch(endpointURL);
  const responseBody: StatusResponse = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseVersion />
      <MaxDbConnections />
      <ConnectionsUsed />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchEndpoint, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseVersion() {
  const { isLoading, data } = useSWR("api/v1/status", fetchEndpoint);
  let databaseVersion = "";

  if (!isLoading && data) {
    databaseVersion = data.dependencies.database.postgres_version;
  }

  return <div>Database version: {databaseVersion}</div>;
}

function MaxDbConnections() {
  const { isLoading, data } = useSWR("api/v1/status", fetchEndpoint);
  let maxConnections;

  if (!isLoading && data) {
    maxConnections = data.dependencies.database.max_connections;
  }

  return <div>Maximum connections allowed: {maxConnections}</div>;
}

function ConnectionsUsed() {
  const { isLoading, data } = useSWR("api/v1/status", fetchEndpoint);
  let connectionsUsed;

  if (!isLoading && data) {
    connectionsUsed = data.dependencies.database.used_connections;
  }

  return <div>Connections being used: {connectionsUsed}</div>;
}
