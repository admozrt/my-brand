import initSqlJs, { type Database } from 'sql.js';
import { openDB, type IDBPDatabase } from 'idb';
import { SCHEMA_SQL } from './schema';
import { loadSeedIntoDb } from './seedLoader';
import fashionSeed from '../../../seeds/fashion.seed.json';

const IDB_NAME = 'my-brand-db';
const IDB_STORE = 'sqlite';
const IDB_KEY = 'main';

let dbInstance: Database | null = null;
let dbPromise: Promise<Database> | null = null;

function openMetaDb(): Promise<IDBPDatabase> {
  return openDB(IDB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    },
  });
}

async function loadPersistedBytes(): Promise<Uint8Array | undefined> {
  const idb = await openMetaDb();
  const bytes = await idb.get(IDB_STORE, IDB_KEY);
  idb.close();
  return bytes as Uint8Array | undefined;
}

export async function persistDb(db: Database): Promise<void> {
  const bytes = db.export();
  const idb = await openMetaDb();
  await idb.put(IDB_STORE, bytes, IDB_KEY);
  idb.close();
}

async function createDb(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });

  const persisted = await loadPersistedBytes();
  if (persisted) {
    return new SQL.Database(persisted);
  }

  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  loadSeedIntoDb(db, fashionSeed as never);
  await persistDb(db);
  return db;
}

export function getDb(): Promise<Database> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (!dbPromise) {
    dbPromise = createDb().then((db) => {
      dbInstance = db;
      return db;
    });
  }
  return dbPromise;
}

export async function resetDb(): Promise<void> {
  const idb = await openMetaDb();
  await idb.delete(IDB_STORE, IDB_KEY);
  idb.close();
  dbInstance = null;
  dbPromise = null;
}
