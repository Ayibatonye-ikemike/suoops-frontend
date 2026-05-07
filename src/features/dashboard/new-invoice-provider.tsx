"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Drawer } from "@/components/ui/drawer";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";

interface NewInvoiceContext {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<NewInvoiceContext | null>(null);

/**
 * Provider for the global "+ New Invoice" slide-over.
 *
 * Hosts a single instance of `<InvoiceCreateForm />` in a right-anchored
 * drawer so the invoice-creation flow can be triggered from anywhere
 * (top nav button, mobile bottom-bar, "+" FAB, keyboard shortcut, etc.)
 * without each page embedding its own form.
 */
export function NewInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<NewInvoiceContext>(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [],
  );

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Drawer
        open={open}
        onClose={handleClose}
        title="Create invoice"
        description="Send a new invoice to your customer in seconds."
      >
        <InvoiceCreateForm />
      </Drawer>
    </Ctx.Provider>
  );
}

export function useNewInvoiceDrawer(): NewInvoiceContext {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Fail soft so call-sites outside the dashboard layout don't crash;
    // the button simply becomes a no-op rather than throwing in render.
    return { open: () => {}, close: () => {} };
  }
  return ctx;
}
