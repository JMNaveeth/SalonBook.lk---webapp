const nodemailer = require('nodemailer');
const env = require('../config/env');

const createTransporter = () => {
  if (!env.email.user || !env.email.pass) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.email.host,
    port: parseInt(env.email.port || '587', 10),
    secure: false,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
      console.log(`[EMAIL BODY]: ${text || html}`);
      return true;
    }

    const info = await transporter.sendMail({
      from: `"SalonBook LK" <${env.email.user}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return false;
  }
};

module.exports = sendEmail;
