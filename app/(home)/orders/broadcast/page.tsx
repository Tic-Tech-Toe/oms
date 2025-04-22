// app/broadcast/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const mockContacts = [
  { id: 1, name: 'Rishi', phone: '919635901369' },
  { id: 2, name: 'Kiran', phone: '918273645011' },
  { id: 3, name: 'Anjali', phone: '919998887776' },
];

export default function BroadcastPage() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [template, setTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const toggleContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleBroadcast = async () => {
    if (!template || !customMessage || selectedContacts.length === 0) {
      toast({
        title: 'Missing fields ⚠️',
        description: 'Please select contacts, template and type a message.',
      });
      return;
    }

    // Send to backend
    // await sendBroadcast(selectedContacts, template, customMessage)

    toast({
      title: 'Broadcast Sent ✅',
      description: `Message sent to ${selectedContacts.length} contacts.`,
    });

    // Reset
    setSelectedContacts([]);
    setCustomMessage('');
  };

  return (
    <div className="min-h-screen px-6  bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-background dark:to-gray-900">
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

          {/* Message Box */}
          {/* <div>
            <Label className="mb-1 text-sm text-muted-foreground">Custom Message</Label>
            <Textarea
              placeholder="Type your message here..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
          </div> */}

          {/* Contacts List */}
          <div>
            <Label className="mb-2 text-sm text-muted-foreground">Select Contacts</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {mockContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-zinc-800"
                >
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    className='bg-background'
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

          {/* Send Button */}
          <div className="text-center pt-4">
            <Button onClick={handleBroadcast} className="text-lg px-6 py-2 rounded-xl bg-light-primary text-white" variant="default">
               Send Broadcast
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
