'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/app/config/firebase';
import { useCustomerStore } from '@/hooks/zustand_stores/useCustomerStore';

export default function BroadcastPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [template, setTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();
  const userId = auth.currentUser?.uid;
  const { customers, loadCustomers } = useCustomerStore();

  useEffect(() => {
    if (userId) {
      loadCustomers(userId);
    }
  }, [userId, loadCustomers]);

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleBroadcast = async () => {
    if (!template || !selectedContacts.length) {
      toast({
        title: 'Missing fields ⚠️',
        description: 'Please select contacts and a template.',
      });
      return;
    }

    // await sendBroadcast(selectedContacts, template, customMessage)

    toast({
      title: 'Broadcast Sent ✅',
      description: `Message sent to ${selectedContacts.length} contacts.`,
    });

    setSelectedContacts([]);
    setCustomMessage('');
  };

  return (
    <div className="min-h-screen relative px-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
      {/* Main Card */}
      <Card className="w-full max-w-4xl mx-auto shadow-xl border-none rounded-3xl bg-white dark:bg-zinc-900">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-dark-primary">
            📣 Send a Broadcast Message
          </CardTitle>
          <p className="text-muted-foreground mt-1">Reach multiple contacts at once via WhatsApp</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Input */}
          <div>
            <Label className="mb-1 text-sm text-muted-foreground">Template Name</Label>
            <Input
              placeholder="e.g. payment_reminder_3"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>

          {/* Contacts List */}
          <div>
            <Label className="mb-2 text-sm text-muted-foreground">Select Contacts</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {customers.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800"
                >
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    className="bg-background"
                    onCheckedChange={() => toggleContact(contact.id)}
                  />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Dock - Shown only if some contacts selected */}
      {selectedContacts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 shadow-lg border dark:border-zinc-700 rounded-full px-6 py-3 flex items-center gap-4 z-50">
          <span className="font-semibold text-dark-primary dark:text-white">
            {selectedContacts.length} {selectedContacts.length === 1 ? 'Contact' : 'Contacts'} Selected
          </span>
          <Button
            onClick={handleBroadcast}
            className="rounded-full bg-light-primary hover:bg-light-primary/90 text-white"
          >
            Send Now
          </Button>
        </div>
      )}
    </div>
  );
}
