"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, User, Loader2, Phone } from "lucide-react"; // Only use necessary icons

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const inviteToken = params.get("secret");
  
  // Form states (kept as is, including phone state)
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NOTE: The decodeEmailFromSecret function is unused in this final version,
  // but keeping it here for completeness if you decide to use it later.

  const handleSubmit = async () => {
    if (!name || !company || !phone) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Endpoint is /api/request-access
      const res = await fetch("/api/request-access", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: inviteToken, 
          phone,
          name,
          company,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // 🚀 SUCCESS ACTION: Redirect to the pending approval page
        toast({
          title: "Request Submitted!",
          description: "Your account is awaiting administrator approval. ✅",
        });
        
        // Redirect to a specific "waiting" page
        router.push("/thank-you"); 
        
      } else {
        toast({
          title: "Submission Error",
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
    <div className="max-w-md mx-auto mt-24 p-8 rounded-2xl border border-muted bg-card shadow-lg space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to <span className="text-[#4f46e5]">ShipTrack</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Please fill up details to get your login credentials.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Phone field to allow my register users to login with otp */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Phone className="w-4 h-4 mr-1 text-muted-foreground" />
            Phone Number (For OTP Login)
          </label>
          <Input
            value={phone}
            placeholder="Your phone number"
            // Note: Removed the disabled/read-only styling to allow input
            onChange={(e) => setPhone(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <User className="w-4 h-4 mr-1 text-muted-foreground" />
            Full Name
          </label>
          <Input
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Briefcase className="w-4 h-4 mr-1 text-muted-foreground" />
            Company
          </label>
          <Input
            type="text"
            placeholder="Your company or startup"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !name || !company || !phone}
          className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 transition text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            "Submit Access Request"
          )}
        </Button>
      </div>
    </div>
  );
}