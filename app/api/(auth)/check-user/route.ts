// /api/check-user.ts
import { db } from "@/app/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ exists: false }), { status: 400 });
  }

  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);

  if (snap.empty) {
    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  }

  const userData = snap.docs[0].data();

  return new Response(
    JSON.stringify({
      exists: true,
      role: userData.role || null,
    }),
    { status: 200 }
  );
}
