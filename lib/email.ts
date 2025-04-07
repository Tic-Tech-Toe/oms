import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminApprovalEmail({
  name,
  company,
  requestId,
}: {
  name: string
  company?: string
  requestId: string
}) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const approvalLink = `${baseUrl}/admin/invite?requestId=${requestId}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [adminEmail],
    subject: 'New Access Request 🚀',
    html: `
      <h2>New Signup Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <p><a href="${approvalLink}" target="_blank">Click here to approve or reject</a></p>
    `,
  })
}

export async function sendPasswordSetupEmail({
  name,
  email,
  link,
}: {
  name: string
  email: string
  link: string
}) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [email],
    subject: 'Welcome to ShipTrack! Set your password',
    html: `
      <h2>Hi ${name},</h2>
      <p>👋 Welcome aboard ShipTrack!</p>
      <p>Your request has been approved and you're now part of our community.</p>
      <p>Please click the button below to set your password and get started:</p>
      <p style="margin: 20px 0;"><a href="${link}" target="_blank" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #1D4ED8;
        color: white;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      ">Set Your Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <br />
      <p>– The ShipTrack Team 🚚</p>
    `,
  })
}
