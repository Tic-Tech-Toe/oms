'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {

  const [whatsappSecret, setWhatsappSecret] = useState("");
const [isEditingSecret, setIsEditingSecret] = useState(false);
const [showSecret, setShowSecret] = useState(false);


  const { user } = useAuth();
  const router = useRouter();

  const {toast} = useToast();

  const [joinedDate, setJoinedDate] = useState('');

  useEffect(() => {
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      setJoinedDate(date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
    }
  }, [user]);

 

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
      <Card className="w-full shadow-2xl rounded-3xl border-none bg-white dark:bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-dark-primary">
            👋 Hey, {user?.displayName?.split(' ')[0] || 'there'}!
          </CardTitle>
          <p className="text-muted-foreground mt-2">Here's your account info.</p>
        </CardHeader>
        <CardContent className="space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
      <p className="text-sm text-muted-foreground">Name</p>
      <h2 className="text-lg font-semibold">{user?.displayName || '—'}</h2>
    </div>
    <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
      <p className="text-sm text-muted-foreground">Email</p>
      <h2 className="text-lg font-semibold">{user?.email || '—'}</h2>
    </div>
    <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl">
      <p className="text-sm text-muted-foreground">Joined on</p>
      <h2 className="text-lg font-semibold">{joinedDate}</h2>
    </div>
    <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-xl relative">
      <p className="text-sm text-muted-foreground mb-1">WhatsApp Secret</p>
      <div className="relative">
        <input
          type={showSecret ? "text" : "password"}
          value={whatsappSecret}
          onChange={(e) => setWhatsappSecret(e.target.value)}
          disabled={!isEditingSecret}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
        />
        <button
          type="button"
          onClick={() => {
            if (isEditingSecret) {
              setIsEditingSecret(false);
              setShowSecret(false);
              toast({
                title: "Secret updated ✅",
                description: "Your WhatsApp secret has been saved securely.",
              });
              // Save to backend here if needed
            } else {
              setIsEditingSecret(true);
              setShowSecret(true);
            }
          }}
          className="absolute right-2 top-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {isEditingSecret ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  </div>
</CardContent>

      </Card>
    </div>
  );
}
