import "server-only";

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

import { SCHEMA_SQL } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

let db: Database.Database | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initSchema(database: Database.Database) {
  database.exec(SCHEMA_SQL);
}

export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  ensureDataDir();
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);

  return db;
}

export function getDbStatus() {
  const database = getDb();
  const tracks = database
    .prepare("SELECT COUNT(*) AS count FROM tracks")
    .get() as { count: number };
  const sets = database
    .prepare("SELECT COUNT(*) AS count FROM sets")
    .get() as { count: number };

  return {
    path: DB_PATH,
    trackCount: tracks.count,
    setCount: sets.count,
  };
}
