import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminApprovalEmail({ name, company, requestId }: {
  name: string,
  company?: string,
  requestId: string
}) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL!
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  // const baseUrl = "http://localhost:3000"

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
