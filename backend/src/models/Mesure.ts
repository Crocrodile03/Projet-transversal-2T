import Database from 'better-sqlite3';
import path from 'path';

export interface IMesure {
  topic: string;
  valeur: string;
  heure: string;
}

const dbPath = path.join(__dirname, '..', '..', 'db', 'dev.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS MESURE (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    valeur TEXT NOT NULL,
    heure TEXT NOT NULL
  )
`).run();

export default class Mesure {
  public topic: string;
  public valeur: string;
  public heure: string;

  constructor(data: IMesure) {
    this.topic = data.topic;
    this.valeur = data.valeur;
    this.heure = data.heure;
  }

  public save(): void {
    db.prepare('INSERT INTO MESURE (topic, valeur, heure) VALUES (?, ?, ?)').run(
      this.topic,
      this.valeur,
      this.heure
    );
  }

  public static findRecent(limit = 50): IMesure[] {
    const rows = db.prepare(
      'SELECT topic, valeur, heure FROM MESURE ORDER BY id DESC LIMIT ?'
    ).all(limit) as IMesure[];
    return rows;
  }
}
