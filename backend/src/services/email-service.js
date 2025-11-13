// src/services/email-service.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com", // Brevo (Sendinblue) host
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSubscriptionEmail({ to, subject, html }) {
  if (!to) return;
  await transporter.sendMail({
    from: `"Orb AI Billing" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    html,
  });
}

export function successTemplate({ name, plan, amount, periodEnd }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif">
      <h2>Payment Successful ✅</h2>
      <p>Hi ${name || "there"}, thanks for subscribing to <b>${plan}</b>.</p>
      <p>Your next renewal date is <b>${new Date(periodEnd).toDateString()}</b>.</p>
      <p>Amount charged: <b>${amount}</b></p>
      <p>— Team Orb AI</p>
    </div>
  `;
}

export function renewalTemplate({ name, daysLeft, periodEnd }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif">
      <h2>Renewal Reminder</h2>
      <p>Hi ${name || "there"}, your subscription renews in <b>${daysLeft} day(s)</b>.</p>
      <p>Renewal date: <b>${new Date(periodEnd).toDateString()}</b>.</p>
      <p>Manage billing anytime from your account portal.</p>
    </div>
  `;
}
