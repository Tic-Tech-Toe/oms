import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminApprovalEmail({
  name,
  company,
  requestId,
}: {
  name: string;
  company?: string;
  requestId: string;
}) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const approvalLink = `${baseUrl}/admin/invite?requestId=${requestId}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [adminEmail],
    subject: "New Access Request 🚀",
    html: `
      <h2>New Signup Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <p><a href="${approvalLink}" target="_blank">Click here to approve or reject</a></p>
    `,
  });
}

export async function sendPasswordSetupEmail({
  name,
  email,
  link,
}: {
  name: string;
  email: string;
  link: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password!)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ShipTrack – Set Your Password ✨",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
        <h2 style="color: #6366f1;">👋 Welcome aboard, ${name}!</h2>
        <p style="font-size: 16px;">Your request has been approved. You're officially a part of ShipTrack 🚀</p>
        <p style="margin: 24px 0;">
          <a href="${link}" target="_blank" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: #ffffff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          ">
            Set Your Password
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">If you didn't request this, you can safely ignore this email.</p>
        <br />
        <p style="font-size: 16px;">– The ShipTrack Team 🚚</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log('✅ Password setup email sent to', email);
  } catch (err) {
    console.error("❌ Failed to send password setup email:", err);
    throw err;
  }
}
