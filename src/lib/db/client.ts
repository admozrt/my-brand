import initSqlJs, { type Database } from 'sql.js';
import { openDB, type IDBPDatabase } from 'idb';
import { SCHEMA_SQL } from './schema';
import { loadSeedIntoDb } from './seedLoader';
import fashionSeed from '../../../seeds/fashion.seed.json';

const IDB_NAME = 'my-brand-db';
const IDB_STORE = 'sqlite';
const KEY_MAIN = 'main';
const KEY_DIRTY = 'dirty';
const KEY_ORIGIN_HASH = 'originHash';

/** Published database, committed to the repo by the developer after an admin export. See PANDUAN-DEPLOY-UMKM.md. */
const REMOTE_DATA_URL = '/data.sqlite';

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

interface LocalMeta {
  bytes?: Uint8Array;
  dirty: boolean;
  originHash?: string;
}

async function loadLocalMeta(): Promise<LocalMeta> {
  const idb = await openMetaDb();
  const [bytes, dirty, originHash] = await Promise.all([
    idb.get(IDB_STORE, KEY_MAIN),
    idb.get(IDB_STORE, KEY_DIRTY),
    idb.get(IDB_STORE, KEY_ORIGIN_HASH),
  ]);
  idb.close();
  return { bytes, dirty: Boolean(dirty), originHash };
}

async function hashBytes(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface RemoteData {
  bytes: Uint8Array;
  hash: string;
}

const SQLITE_MAGIC = 'SQLite format 3\0';

/**
 * A missing `public/data.sqlite` doesn't reliably 404: both the Vite dev server (SPA fallback) and
 * Cloudflare Pages (our own `_redirects` catch-all) respond 200 with `index.html` for any unmatched
 * path. Checking the SQLite file header is the only environment-proof way to tell "real database" from
 * "fallback HTML page".
 */
function isValidSqliteFile(bytes: Uint8Array): boolean {
  if (bytes.byteLength < SQLITE_MAGIC.length) return false;
  for (let i = 0; i < SQLITE_MAGIC.length; i++) {
    if (bytes[i] !== SQLITE_MAGIC.charCodeAt(i)) return false;
  }
  return true;
}

/** Fetches the published `data.sqlite`, if the project has one committed. Returns null when absent (brand new project) or unreachable. */
async function fetchRemoteData(): Promise<RemoteData | null> {
  try {
    const response = await fetch(REMOTE_DATA_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (!isValidSqliteFile(bytes)) return null;
    const hash = await hashBytes(buffer);
    return { bytes, hash };
  } catch {
    return null;
  }
}

/** Adopts a freshly fetched published database as the local copy: clean slate, eligible for future auto-refresh. */
async function adoptRemote(remote: RemoteData): Promise<void> {
  const idb = await openMetaDb();
  await idb.put(IDB_STORE, remote.bytes, KEY_MAIN);
  await idb.put(IDB_STORE, false, KEY_DIRTY);
  await idb.put(IDB_STORE, remote.hash, KEY_ORIGIN_HASH);
  idb.close();
}

/** Persists the initial JSON-seeded bootstrap database. Left "clean" (not dirty) so it can still be replaced once a `data.sqlite` is published later. */
async function persistFresh(db: Database): Promise<void> {
  const bytes = db.export();
  const idb = await openMetaDb();
  await idb.put(IDB_STORE, bytes, KEY_MAIN);
  await idb.put(IDB_STORE, false, KEY_DIRTY);
  idb.close();
}

/**
 * Persists local mutations made through the admin dashboard (CRUD on products, brand settings, etc.).
 * Marks the local copy "dirty" so it stops auto-syncing from the published `data.sqlite` until the
 * admin re-exports and the developer republishes — otherwise an in-progress edit could be silently
 * overwritten by an older or unrelated published snapshot on the next page load.
 */
export async function persistDb(db: Database): Promise<void> {
  const bytes = db.export();
  const idb = await openMetaDb();
  await idb.put(IDB_STORE, bytes, KEY_MAIN);
  await idb.put(IDB_STORE, true, KEY_DIRTY);
  idb.close();
}

async function createDb(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  const local = await loadLocalMeta();

  if (!local.bytes) {
    const remote = await fetchRemoteData();
    if (remote) {
      await adoptRemote(remote);
      return new SQL.Database(remote.bytes);
    }

    const db = new SQL.Database();
    db.run(SCHEMA_SQL);
    loadSeedIntoDb(db, fashionSeed as never);
    await persistFresh(db);
    return db;
  }

  if (!local.dirty) {
    const remote = await fetchRemoteData();
    if (remote && remote.hash !== local.originHash) {
      await adoptRemote(remote);
      return new SQL.Database(remote.bytes);
    }
  }

  return new SQL.Database(local.bytes);
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
  await idb.delete(IDB_STORE, KEY_MAIN);
  await idb.delete(IDB_STORE, KEY_DIRTY);
  await idb.delete(IDB_STORE, KEY_ORIGIN_HASH);
  idb.close();
  dbInstance = null;
  dbPromise = null;
}
