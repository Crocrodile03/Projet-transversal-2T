import Database from 'better-sqlite3';
import path from 'path';

export interface ILog {
  nom: string;
  heure: string;
  etat: string;
}

const dbPath = path.join(__dirname, '..', '..', 'db', 'dev.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS LOG (
    nom TEXT NOT NULL PRIMARY KEY UNIQUE,
    heure TEXT NOT NULL,
    etat TEXT NOT NULL
  )
`).run();

export default class Log {
  public nom: string;
  public heure: string;
  public etat: string;

  constructor(data: ILog) {
    this.nom = data.nom;
    this.heure = data.heure;
    this.etat = data.etat;
  }

  public async save(): Promise<Log> {
    const stmt = db.prepare('INSERT OR REPLACE INTO LOG (nom, heure, etat) VALUES (?, ?, ?)');
    stmt.run(this.nom, this.heure, this.etat);
    return this;
  }

  public toObject(): ILog {
    return {
      nom: this.nom,
      heure: this.heure,
      etat: this.etat,
    };
  }

  public static async findOne(filter: { nom?: string }): Promise<Log | null> {
    if (!filter.nom) {
      return null;
    }

    const row = db.prepare('SELECT nom, heure, etat FROM LOG WHERE nom = ?').get(filter.nom);
    if (!row) {
      return null;
    }

    return new Log({ nom: row.nom, heure: row.heure, etat: row.etat });
  }
}
