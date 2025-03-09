type DatabaseStatus = {
  postgres_version: string;
  max_connections: number;
  used_connections: number;
};

type StatusResponse = {
  updated_at: string;
  dependencies: {
    database: DatabaseStatus;
  };
};

type Migration = {};

type MigrationResponse = Migration[];
