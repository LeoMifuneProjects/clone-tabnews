import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
export default async function migrations(request, response) {
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }

    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);

    return response.status(200).json(pendingMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    dbClient.end();
  }
}
