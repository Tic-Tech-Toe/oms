"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeSwitch from "@/components/ThemeSwitch";
import AccessRequests from "@/components/admin/AccessRequest";
import AllUsers from "@/components/admin/AllUsers";
// import { toast } from 'sonner'

const InviteAdminPage = () => {
  const { user, loading } = useAuth();
  const [inviteLink, setInviteLink] = useState("");
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { logout } = useAuth()

  const { toast } = useToast();

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!loading && user && user.email !== adminEmail) {
      router.push("/not-authorized");
    }
  }, [loading, user, router]);

  const generateInvite = async () => {
    setGenerating(true);
    setError("");
    try {
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch("/api/generate-invite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setInviteLink(data.link);

        toast({
          title: "Invite Sent ✅",
          description: "The user has received an email to join.",
        });
      } else {
        setError(data.error || "Something went wrong.");
        toast({
          title: "Error ❌",
          description: data.error || "Failed to send invite.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error generating invite.");
      toast({
        title: "Error ❌",
        description: "Something went wrong while generating the invite.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied to Clipboard 📋",
      description: "Invite link copied successfully.",
    });
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4">
      <div className="mb-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">
            Welcome, {user.displayName?.split(" ")[0] || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <Button className="bg-light-primary/80 text-white hover:scale-[1.02] transition-all duration-200 rounded-full px-6 py-2 backdrop-blur-sm shadow-md hover:shadow-lg" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Manage users, invites and requests
        </p>
      </div>

      {/* Invite Section */}
      <div className="rounded-xl border bg-card p-6 mb-10 shadow-md">
        <h2 className="text-xl font-medium mb-4">Send Invite</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Input
            type="email"
            placeholder="Enter email to invite"
            className="w-full md:w-[300px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={generateInvite}
            disabled={generating}
            variant="default"
            className="bg-light-primary text-white"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Generating...
              </>
            ) : (
              "Generate Invite"
            )}
          </Button>
        </div>

        {inviteLink && (
          <div className="mt-4 flex items-center gap-2">
            <p className="text-sm break-all">{inviteLink}</p>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      {/* Tables (placeholder for now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <h3 className="font-medium text-lg mb-2">Pending Requests</h3>
          <AccessRequests />
          {/* TODO: List requests from Firestore */}
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-medium text-lg mb-2">All Users</h3>
          {/* TODO: List users from Firestore */}
          <AllUsers />
        </div>
      </div>
    </div>
  );
};

export default InviteAdminPage;
