import Database from 'better-sqlite3';
import path from 'path';

export interface IUser {
  username: string;
  password: string;
}

const dbPath = path.join(__dirname, '..', '..', 'db', 'dev.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS User (
    username TEXT NOT NULL PRIMARY KEY UNIQUE,
    password TEXT NOT NULL
  )
`).run();

export default class User {
  public username: string;
  public password: string;

  constructor(data: IUser) {
    this.username = data.username;
    this.password = data.password;
  }

  public async save(): Promise<User> {
    try {
      db.prepare('INSERT INTO User (username, password) VALUES (?, ?)').run(this.username, this.password);
      return this;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
        throw new Error('Username already taken');
      }
      throw err;
    }
  }

  public toObject(): IUser {
    return {
      username: this.username,
      password: this.password,
    };
  }

  public static async findOne(filter: { username?: string }): Promise<User | null> {
    if (!filter.username) {
      return null;
    }

    const row = db.prepare('SELECT username, password FROM User WHERE username = ?').get(filter.username);
    if (!row) {
      return null;
    }

    return new User({
      username: row.username,
      password: row.password,
    });
  }
}