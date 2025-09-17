// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 465),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(to, resetLink) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Réinitialisation du mot de passe',
    text: `Pour réinitialiser votre mot de passe, cliquez sur ce lien : ${resetLink}`,
    html: `<p>Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :</p>
           <p><a href="${resetLink}">${resetLink}</a></p>`,
  });
  return info;
}

module.exports = { sendResetEmail };
