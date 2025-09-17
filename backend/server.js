// server.js
require('dotenv').config(); // Charger les variables d'environnement

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth'); // Routes forgot/reset password

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------
// Middleware
// ---------------------
app.use(cors());
app.use(express.json()); // Permet de lire le JSON envoyé par le frontend

// ---------------------
// Test route API
// ---------------------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Bonjour depuis Express !' });
});

// ---------------------
// Test de connexion PostgreSQL
// ---------------------
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL', err);
  } else {
    console.log('✅ Connexion réussie à PostgreSQL - Heure :', result.rows[0]);
  }
});

// ---------------------
// SIGNUP (inscription)
// ---------------------
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la base
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur créé ✅', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

// ---------------------
// LOGIN (connexion)
// ---------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l’utilisateur existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    res.json({ message: 'Connexion réussie ✅', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du login' });
  }
});

// ---------------------
// Routes "Forgot/Reset Password"
// ---------------------
app.use('/auth', authRoutes);

// ---------------------
// Lancement du serveur
// ---------------------
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
