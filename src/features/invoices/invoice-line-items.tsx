import { Button } from "@/components/ui/button";

export interface LineDraft {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceLineItemsProps {
  lines: LineDraft[];
  onUpdateLine: (id: string, patch: Partial<LineDraft>) => void;
  onRemoveLine: (id: string) => void;
  onAddLine: () => void;
}

export function InvoiceLineItems({
  lines,
  onUpdateLine,
  onRemoveLine,
  onAddLine,
}: InvoiceLineItemsProps) {
  return (
    <section className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-brand-text">Line items</h3>
        <Button type="button" size="sm" onClick={onAddLine}>
          Add line
        </Button>
      </header>
      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.id}
            className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[2fr_repeat(2,_minmax(100px,_1fr))_auto]"
          >
            <input
              value={line.description}
              onChange={(e) => onUpdateLine(line.id, { description: e.target.value })}
              placeholder="Description"
              className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:col-span-2 md:col-span-1"
            />
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 md:col-span-2 md:grid-cols-2">
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => onUpdateLine(line.id, { quantity: Number(e.target.value) })}
                placeholder="Qty"
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={line.unit_price}
                onChange={(e) => onUpdateLine(line.id, { unit_price: Number(e.target.value) })}
                placeholder="Price"
                className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveLine(line.id)}
              disabled={lines.length === 1}
              className="justify-self-start sm:justify-self-end md:justify-self-start text-sm font-semibold text-brand-jade transition hover:text-brand-jade/80 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 md:col-span-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
