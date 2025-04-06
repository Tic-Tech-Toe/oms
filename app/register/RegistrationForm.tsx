"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const secret = params.get("secret");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [whatsappSecret, setWhatsappSecret] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !whatsappSecret || !password || !confirmPassword) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          name,
          company,
          whatsappSecret,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Request sent!",
          description: "Waiting for admin approval ✅",
        });
        router.push("/thank-you"); // optional
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 rounded-2xl border border-muted bg-card shadow-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to, <span className="text-light-primary">ShipTrack</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Finish your signup to start tracking like a pro.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-light-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name{" "}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-light-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            WhatsApp Secret
          </label>
          <Input
            placeholder="Something only you remember"
            value={whatsappSecret}
            onChange={(e) => setWhatsappSecret(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-light-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-light-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-light-primary"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-light-primary hover:bg-light-primary/90 transition"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
}
