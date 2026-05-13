const Database = require('better-sqlite3');
const db = new Database('dev.db'); 

// Création de la table User
db.prepare(`
  CREATE TABLE IF NOT EXISTS User (
    username TEXT NOT NULL PRIMARY KEY UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS LOG (
    nom TEXT NOT NULL PRIMARY KEY UNIQUE,
    mesure TEXT NOT NULL,
    etat TEXT NOT NULL
  )
`).run();

console.log("Base de données et table User créées avec succès !");
db.close();

// node init-db.js pour initialiser la db