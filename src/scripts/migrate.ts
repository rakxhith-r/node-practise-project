import path from "node:path";
import { Pool } from "pg";
import { pool } from "../lib/db";
import fs from "node:fs";
import { logger } from "../lib/logger";

type MigrationRow = {
  name: string;
};

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

const CREATE_MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
)
`;

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query<MigrationRow>(
    "SELECT name FROM migrations ORDER BY name",
  );

  return result.rows.map((row: MigrationRow) => row.name);
}

function getMigratedFiles(): string[] {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function runMigration(fileName: string): Promise<void> {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, fileName), "utf-8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT into migrations (name) values ($1)", [fileName]);
    await client.query("COMMIT");

    logger.info(`migration completed: ${fileName}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function migrate(): Promise<void> {
  await pool.query(CREATE_MIGRATIONS_TABLE);

  const executed = new Set(await getExecutedMigrations());
  const pending = getMigratedFiles().filter((file) => !executed.has(file));

  if (pending.length === 0) {
    logger.info("No pending migration");
    return;
  }

  for (const filename of pending) {
    await runMigration(filename);
  }

  logger.info("All Migrations Completed");
}

migrate()
  .catch((error) => {
    logger.error({ err: error }, "Migrations Failed");
    process.exit(1);
  })
  .finally(() => pool.end());
