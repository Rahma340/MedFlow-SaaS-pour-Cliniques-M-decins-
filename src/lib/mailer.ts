import nodemailer from "nodemailer";
import * as path from "path";
import dotenv from "dotenv";

// Charge explicitement le fichier .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("📨 Mailtrap config :", {
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
});

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendInvitationEmail(email: string, inviteLink: string) {
  console.log("📧 Tentative d'envoi à :", email);
  try {
    const info = await transporter.sendMail({
      from: '"MedFlow 👩‍⚕️" <no-reply@medflow.com>',
      to: email,
      subject: "Invitation à rejoindre la clinique MedFlow",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Bienvenue sur MedFlow !</h2>
          <p>Vous avez été invité à rejoindre la clinique.</p>
          <a href="${inviteLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
            Accepter l’invitation
          </a>
          <p style="margin-top:20px;color:#555;">Si vous n’attendiez pas cet email, vous pouvez l’ignorer.</p>
        </div>
      `,
    });

    console.log("✅ Email envoyé :", info.messageId);
  } catch (error: any) {
    console.error("❌ Erreur d’envoi :", error);
  }
}
