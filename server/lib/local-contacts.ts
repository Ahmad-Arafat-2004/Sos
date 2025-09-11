import fs from 'fs';
import path from 'path';

const CONTACTS_FILE = path.resolve(process.cwd(), 'server/lib/local-contacts.json');

function ensureFile() {
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.mkdirSync(path.dirname(CONTACTS_FILE), { recursive: true });
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify({ messages: [] }, null, 2), 'utf8');
  }
}

export function readContacts() {
  ensureFile();
  const raw = fs.readFileSync(CONTACTS_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    const init = { messages: [] };
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(init, null, 2), 'utf8');
    return init;
  }
}

export function writeContacts(data: any) {
  ensureFile();
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function addContactMessage(message: any) {
  const db = readContacts();
  db.messages.unshift({ id: `m_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, ...message, created_at: new Date().toISOString() });
  writeContacts(db);
  return db.messages[0];
}
