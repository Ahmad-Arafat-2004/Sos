import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export interface LocalUserRecord {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
  password_hash: string;
}

interface LocalDbSchema {
  users: LocalUserRecord[];
}

const DB_FILE = path.resolve(process.cwd(), "server/lib/local-db.json");

function ensureFile(): void {
  if (!fs.existsSync(DB_FILE)) {
    const now = new Date().toISOString();
    const initial: LocalDbSchema = {
      users: [
        {
          id: "admin-local-0001",
          email: "admin@irthbiladi.com",
          name: "Administrator",
          role: "admin",
          created_at: now,
          updated_at: now,
          password_hash: bcrypt.hashSync("admin123", 10),
        },
      ],
    };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readDb(): LocalDbSchema {
  ensureFile();
  const raw = fs.readFileSync(DB_FILE, "utf8");
  try {
    return JSON.parse(raw) as LocalDbSchema;
  } catch {
    const reset: LocalDbSchema = { users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(reset, null, 2), "utf8");
    return reset;
  }
}

function writeDb(db: LocalDbSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

export const localDb = {
  getUserByEmail(email: string): LocalUserRecord | undefined {
    const db = readDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById(id: string): LocalUserRecord | undefined {
    const db = readDb();
    return db.users.find((u) => u.id === id);
  },
  createUser(input: {
    email: string;
    name: string;
    password_hash: string;
    role?: "user" | "admin";
  }): LocalUserRecord {
    const db = readDb();
    const now = new Date().toISOString();
    const user: LocalUserRecord = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
      role: input.role ?? "user",
      created_at: now,
      updated_at: now,
      password_hash: input.password_hash,
    };
    db.users.push(user);
    writeDb(db);
    return user;
  },
  updateUser(
    id: string,
    updates: Partial<Omit<LocalUserRecord, "id" | "created_at">>,
  ): LocalUserRecord | undefined {
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    db.users[idx] = {
      ...db.users[idx],
      ...updates,
      updated_at: now,
    } as LocalUserRecord;
    writeDb(db);
    return db.users[idx];
  },
};
