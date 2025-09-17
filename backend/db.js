const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // ton utilisateur postgres
  host: 'localhost',        // serveur local
  database: 'hello_next_db',// la base que tu as créée
  password: 'citron',     // le mot de passe que tu as défini
  port: 5432,               // port PostgreSQL par défaut
});

module.exports = pool;
