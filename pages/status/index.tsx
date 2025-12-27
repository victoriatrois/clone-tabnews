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
      <h1>Database Status</h1>
      <UpdatedAt />
      <DatabaseInformation />
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

function DatabaseInformation() {
  const { isLoading, data } = useSWR("api/v1/status", fetchEndpoint, {
    refreshInterval: 2000,
  });

  let databaseInfo;

  if (!isLoading && data) {
    databaseInfo = (
      <>
        <div>Version: {data.dependencies.database.postgres_version}</div>
        <div>
          Maximum connections allowed:
          {data.dependencies.database.max_connections}
        </div>
        <div>
          Connections being used: {data.dependencies.database.used_connections}
        </div>
      </>
    );

    return <div>{databaseInfo}</div>;
  }
}
