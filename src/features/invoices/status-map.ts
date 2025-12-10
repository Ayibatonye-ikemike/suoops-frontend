export const invoiceStatusLabels: Record<string, { label: string; tone: "neutral" | "success" | "warning" | "danger" }> = {
  pending: { label: "Awaiting bank transfer", tone: "warning" },
  awaiting_confirmation: { label: "Awaiting your confirmation", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  failed: { label: "Closed without payment", tone: "danger" },
};

export const invoiceStatusHelpText: Record<string, string> = {
  pending: "Customer must confirm they've sent payment before you can mark as paid. Share the payment link below.",
  awaiting_confirmation: "Customer confirmed payment. Check your bank, then mark as paid to send receipt and deduct inventory.",
  paid: "Payment verified and receipt sent. Inventory has been deducted.",
  failed: "Use this if the invoice will not be collected.",
};
