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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL';
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
      subject: 'You’re Invited to Join',
      html: `
        <h2>🎉 You’re Invited!</h2>
        <p>Click the link below to sign up:</p>
        <a href="${inviteLink}" style="padding:10px 20px; background-color:#6366f1; color:white; text-decoration:none; border-radius:5px;">Accept Invite</a>
        <p>This link is valid for a limited time.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ link: inviteLink }, { status: 200 });

  } catch (error) {
    console.error('Error generating invite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
