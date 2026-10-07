"use client";

import { useUIKit } from "../provider";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onConfirm: () => void;
  /** Testo del pulsante di conferma. Default: `labels.confirm` del provider. */
  confirmLabel?: string;
}

export function ConfirmationDialog({ open, onOpenChange, message, onConfirm, confirmLabel }: ConfirmationDialogProps) {
  const { labels } = useUIKit();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Foglio dal basso su telefono (centrato da `sm` in su): la scelta
          arriva nella zona del pollice, come un action sheet di iOS, invece
          di costringere a risalire al centro dello schermo. Conferma e
          annulla sono pulsanti pieni da 48px, impilati. */}
      <DialogContent variant="sheet" className="gap-0 bg-white dark:bg-midnight-900 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6" showCloseButton={false}>
        <DialogTitle className="font-bold text-slate-900 dark:text-white text-lg mb-2">{labels.areYouSure}</DialogTitle>
        <DialogDescription className="text-slate-600 dark:text-slate-300 text-base">{message}</DialogDescription>
        <div className="flex flex-col sm:flex-row-reverse gap-2 mt-6">
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            data-press
            className="min-h-12 sm:min-h-10 bg-rose-600 text-white rounded-xl px-4 text-base sm:text-sm font-bold hover:bg-rose-700 cursor-pointer"
          >
            {confirmLabel ?? labels.confirm}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            data-press
            className="min-h-12 sm:min-h-10 bg-slate-100 dark:bg-midnight-800 text-slate-700 dark:text-slate-200 rounded-xl px-4 text-base sm:text-sm font-bold cursor-pointer"
          >
            {labels.cancel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
