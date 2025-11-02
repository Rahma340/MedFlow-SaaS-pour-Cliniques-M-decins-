import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // charge les variables locales

async function main() {
  console.log("📨 Tentative d'envoi via Mailtrap...");

  console.log("🔧 Config :", {
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS ? "********" : undefined,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test MedFlow" <no-reply@medflow.com>',
      to: "test@mailtrap.io", // ou ton adresse Mailtrap Inbox
      subject: "✅ Test Mailtrap depuis MedFlow",
      html: "<h2>Si tu vois ce message, Mailtrap fonctionne !</h2>",
    });

    console.log("✅ Email envoyé :", info.messageId);
  } catch (err) {
    console.error("❌ Erreur d’envoi :", err);
  }
}

main();
