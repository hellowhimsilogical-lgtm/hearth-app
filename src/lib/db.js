import Dexie from 'dexie';

export const db = new Dexie('HearthDB');

db.version(1).stores({
    tasks: '++id, title, completed, family_id, created_by, created_at, synced_at',
    events: '++id, title, starts_at, ends_at, family_id, created_by, synced_at',
});
