import { NextRequest, NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { sendAdminApprovalEmail } from '@/lib/email'
import bcrypt from 'bcrypt'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret, name, company, phone } = body
    console.table({body})
    if (!secret || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const inviteSnap = await db
      .collection('invites')
      .where('secret', '==', secret)
      .where('used', '==', false)
      .limit(1)
      .get()

    if (inviteSnap.empty) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
    }

    const inviteDoc = inviteSnap.docs[0]
    const inviteId = inviteDoc.id
    const inviteData = inviteDoc.data()

    const requestRef = await db.collection('access_requests').add({
      name,
      company,
      phone,
      inviteId,
      email: inviteData.email,
      approved: false,
      createdAt: new Date(),
    })

    await db.collection('invites').doc(inviteId).update({ used: true })

    const requestId = requestRef.id
    await sendAdminApprovalEmail({ name, company, requestId })

    return NextResponse.json({ message: 'Request submitted. Awaiting admin approval.' }, { status: 200 })
  } catch (err) {
    console.error('Error in request-access:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

