'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();

  const toast = useToast();

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
      <Card className="max-w-2xl mx-auto shadow-2xl rounded-3xl border-none bg-white dark:bg-zinc-900">
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
          </div>

          {/* <div className="text-center pt-6">
            <Button onClick={handleResetPassword} className="w-full sm:w-auto">
              Reset Password
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
