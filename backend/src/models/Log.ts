import Database from 'better-sqlite3';
import path from 'path';

export interface ILog {
  nom: string;
  mesure: string;
  etat: string;
}

const dbPath = path.join(__dirname, '..', '..', 'db', 'dev.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS LOG (
    nom TEXT NOT NULL PRIMARY KEY UNIQUE,
    mesure TEXT NOT NULL,
    etat TEXT NOT NULL
  )
`).run();

export default class Log {
  public nom: string;
  public mesure: string;
  public etat: string;

  constructor(data: ILog) {
    this.nom = data.nom;
    this.mesure = data.mesure;
    this.etat = data.etat;
  }

  public async save(): Promise<Log> {
    const stmt = db.prepare('INSERT OR REPLACE INTO LOG (nom, mesure, etat) VALUES (?, ?, ?)');
    stmt.run(this.nom, this.mesure, this.etat);
    return this;
  }

  public toObject(): ILog {
    return {
      nom: this.nom,
      mesure: this.mesure,
      etat: this.etat,
    };
  }

  public static async findOne(filter: { nom?: string }): Promise<Log | null> {
    if (!filter.nom) {
      return null;
    }

    const row = db.prepare('SELECT nom, mesure, etat FROM LOG WHERE nom = ?').get(filter.nom);
    if (!row) {
      return null;
    }

    return new Log({ nom: row.nom, mesure: row.mesure, etat: row.etat });
  }
}
