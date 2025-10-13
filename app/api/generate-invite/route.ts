import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { adminAuth } from '@/lib/auth';
import nodemailer from 'nodemailer';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Admin check (you can enable later)
    // if (!userData?.isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    // }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const inviteSecret = Math.random().toString(36).substring(2, 10);

    await db.collection('invites').add({
      secret: inviteSecret,
      email,
      createdBy: uid,
      createdAt: new Date(),
      used: false,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const inviteLink = `${baseUrl}/register?secret=${inviteSecret}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `You’re Invited to Join Shiptrack`, // More specific subject line
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to Shiptrack</h1>
            </div>

            <div style="padding: 30px;">
                <h2 style="color: #4f46e5; margin-top: 0;">🎉 You’ve Been Invited!</h2>
                
                <p>Hi there,</p>

                <p>The admin of <strong>Shiptrack</strong> has invited you to join their team.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #4b5563;">
                        <strong>Invited to:</strong> Shiptrack <br/>
                        <br/>
                        <strong>Your Role: User </strong>
                    </p>
                </div>

                <p>Click the secure link below to set up your account and accept the invitation:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a 
                        href="${inviteLink}" 
                        style="
                            display: inline-block;
                            padding: 12px 25px; 
                            background-color: #4f46e5; 
                            color: white; 
                            text-decoration: none; 
                            font-weight: bold; 
                            border-radius: 8px; 
                            font-size: 16px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            transition: background-color 0.3s;
                        "
                    >
                        Accept Invitation & Get Started
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    Please note: This invitation link is valid for a limited time 24 hours.
                </p>

            </div>

            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e0e0e0;">
                <p style="margin-bottom: 5px;">If you did not expect this invitation, please ignore this email.</p>
                <p style="margin: 0;">Shiptrack | [https://shiptrack.com]</p>
            </div>
        </div>
    `,
};

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ link: inviteLink }, { status: 200 });

  } catch (error) {
    console.error('Error generating invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
