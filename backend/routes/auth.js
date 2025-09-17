// routes/auth.js
const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const { sendResetEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt');

const router = express.Router();

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Vérifier si l'utilisateur existe
    const userRes = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user) {
      // Cas : email absent de la BDD
      return res.json({
        message: "Si ce compte existe, vous allez recevoir un e-mail.",
        exists: false,
      });
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 heure fa tsy 1 heures

    // Sauvegarder le token en BDD
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expires]
    );

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    // Envoyer l'email
    await sendResetEmail(user.email, resetLink);

    return res.json({
      message: "Email envoyé avec succès",
      exists: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erreur serveur",
      exists: false,
    });
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const tokenRes = await pool.query(
      'SELECT user_id, expires_at, used FROM password_reset_tokens WHERE token = $1',
      [token]
    );

    if (tokenRes.rows.length === 0)
      return res.status(400).json({ message: 'Lien invalide ou expiré' });

    const row = tokenRes.rows[0];
    if (row.used)
      return res.status(400).json({ message: 'Ce lien a déjà été utilisé.' });

    if (new Date(row.expires_at) < new Date())
      return res.status(400).json({ message: 'Le lien a expiré.' });

    // Hacher le nouveau mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
      hashed,
      row.user_id,
    ]);

    // Marquer le token comme utilisé
    await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE token = $1', [token]);

    return res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

