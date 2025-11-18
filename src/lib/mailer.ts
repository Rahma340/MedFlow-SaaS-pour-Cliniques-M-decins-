import nodemailer from "nodemailer";

const host = process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io";
const port = Number(process.env.MAILTRAP_PORT || 2525);
const user = process.env.MAILTRAP_USER;
const pass = process.env.MAILTRAP_PASS;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false, 
  auth: user && pass ? { user, pass } : undefined,
});

export async function verifyMailTransport() {
  try {
    await transporter.verify();
    console.log("✅SMTP ready:", { host, port });
  } catch (e) {
    console.error("❌ SMTP verify failed:", e);
  }
}

export async function sendInvitationEmail(email: string, inviteLink: string) {
  try {
    const info = await transporter.sendMail({
      from: '"MedFlow" <no-reply@medflow.local>',
      to: email,
      subject: "Invitation à rejoindre MedFlow",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Bienvenue 👋</h2>
          <p>Vous avez été invité à rejoindre la clinique sur MedFlow.</p>
          <p><a href="${inviteLink}"
            style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
            Configurer mon mot de passe
          </a></p>
          <p style="color:#64748b;font-size:13px">Si vous n’attendiez pas cet email, ignorez-le.</p>
        </div>
      `,
    });
    console.log("📧 Invitation envoyée:", info.messageId);
    return true;
  } catch (e) {
    console.error("❌ Erreur envoi invitation:", e);
    return false;
  }
}
