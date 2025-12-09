import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useProducts } from "@/features/inventory";
import type { Product } from "@/features/inventory";

export interface LineDraft {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  product_id?: number | null;  // Link to inventory product
}

interface InvoiceLineItemsProps {
  lines: LineDraft[];
  onUpdateLine: (id: string, patch: Partial<LineDraft>) => void;
  onRemoveLine: (id: string) => void;
  onAddLine: () => void;
  showProductPicker?: boolean;  // Enable inventory product selection
}

function ProductSelector({
  value,
  onSelect,
}: {
  value?: number | null;
  onSelect: (product: Product | null) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const { data } = useProducts({ search, page_size: 10 });

  const products = data?.products ?? [];
  const selectedProduct = value
    ? products.find((p) => p.id === value)
    : null;

  return (
    <div className="relative">
      <input
        type="text"
        value={selectedProduct ? selectedProduct.name : search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Search products..."
        className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text outline-none transition focus:border-brand-jade focus:ring-2 focus:ring-brand-jade/20"
      />
      {showDropdown && products.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-brand-border bg-white shadow-lg">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setSearch("");
              setShowDropdown(false);
            }}
            className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
          >
            Clear selection
          </button>
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onSelect(product);
                setSearch("");
                setShowDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-brand-jade/5"
            >
              <div className="font-medium text-brand-text">{product.name}</div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>SKU: {product.sku}</span>
                <span>₦{product.selling_price.toLocaleString()}</span>
                <span className={product.quantity_in_stock > 0 ? "text-green-600" : "text-red-500"}>
                  Stock: {product.quantity_in_stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function InvoiceLineItems({
  lines,
  onUpdateLine,
  onRemoveLine,
  onAddLine,
  showProductPicker = false,
}: InvoiceLineItemsProps) {
  const handleProductSelect = (lineId: string, product: Product | null) => {
    if (product) {
      onUpdateLine(lineId, {
        product_id: product.id,
        description: product.name,
        unit_price: product.selling_price,
      });
    } else {
      onUpdateLine(lineId, {
        product_id: null,
      });
    }
  };

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
            className="space-y-2"
          >
            {/* Product Picker Row (when enabled) */}
            {showProductPicker && (
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-[1fr_auto]">
                <ProductSelector
                  value={line.product_id}
                  onSelect={(product) => handleProductSelect(line.id, product)}
                />
                <span className="text-xs text-gray-500 self-center">
                  {line.product_id ? "Linked to inventory" : "Optional: link to product"}
                </span>
              </div>
            )}
            {/* Line Details Row */}
            <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-[1fr_auto] md:grid-cols-[2fr_repeat(2,_minmax(100px,_1fr))_auto]">
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
          </div>
        ))}
      </div>
    </section>
  );
}
