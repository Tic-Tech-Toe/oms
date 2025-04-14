"use client"

import FasterHero from "@/components/FasterHero";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { app } from "../config/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth,(user) => {
      if(user){
        router.replace("/orders")
      }
    })

    return () => unsubscribe();
  },[router])
  return (
   <FasterHero />
  );
}
