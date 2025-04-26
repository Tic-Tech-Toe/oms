// components/DeliveryWindowDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DateTimePicker from './time-picker/DateTimePicker';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (formattedWindow: string) => void;
};

export default function DeliveryWindowDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Select delivery window</DialogTitle>
        </DialogHeader>

        <DateTimePicker
          onConfirm={(window) => {
            onConfirm(window);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
