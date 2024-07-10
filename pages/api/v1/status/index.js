import database from "infra/database";
async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const queryVersion = await database.query("SHOW server_version;");
  const version = queryVersion.rows[0].server_version;

  const queryMaxConnections = await database.query(
    "SELECT setting AS max_connections FROM pg_settings WHERE name ='max_connections';",
  );
  const maxConnections = parseInt(queryMaxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;

  const queryOpenedConnection = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const openedConnections = queryOpenedConnection.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
