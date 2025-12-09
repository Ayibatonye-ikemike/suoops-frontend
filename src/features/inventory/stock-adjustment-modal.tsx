"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useAdjustStock } from "./use-inventory";
import type { Product, StockMovementType } from "./types";

interface StockAdjustmentModalProps {
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StockAdjustmentModal({ product, onClose, onSuccess }: StockAdjustmentModalProps) {
  const adjustStock = useAdjustStock();

  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState<number>(1);
  const [movementType, setMovementType] = useState<StockMovementType>("purchase");
  const [reason, setReason] = useState("");
  const [unitCost, setUnitCost] = useState<number | undefined>(product.cost_price ?? undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    const finalQuantity = adjustmentType === "add" ? quantity : -quantity;

    // Validate removal doesn't exceed stock
    if (adjustmentType === "remove" && quantity > product.quantity_in_stock) {
      setError(`Cannot remove more than current stock (${product.quantity_in_stock} ${product.unit})`);
      return;
    }

    try {
      await adjustStock.mutateAsync({
        product_id: product.id,
        quantity: finalQuantity,
        movement_type: movementType,
        reason: reason || undefined,
        unit_cost: unitCost,
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail ?? message);
      } else {
        setError(message);
      }
    }
  };

  const newStock = product.quantity_in_stock + (adjustmentType === "add" ? quantity : -quantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Adjust Stock</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
          <p className="text-sm text-gray-500">
            SKU: {product.sku} • Current Stock: <span className="font-semibold">{product.quantity_in_stock} {product.unit}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Add/Remove Toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setAdjustmentType("add");
                setMovementType("purchase");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                adjustmentType === "add"
                  ? "bg-brand-jade text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Plus className="h-4 w-4" />
              Add Stock
            </button>
            <button
              type="button"
              onClick={() => {
                setAdjustmentType("remove");
                setMovementType("adjustment");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                adjustmentType === "remove"
                  ? "bg-red-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Minus className="h-4 w-4" />
              Remove Stock
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity ({product.unit})
            </label>
            <input
              type="number"
              required
              min="1"
              max={adjustmentType === "remove" ? product.quantity_in_stock : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
            />
          </div>

          {/* Movement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason Type
            </label>
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as StockMovementType)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
            >
              {adjustmentType === "add" ? (
                <>
                  <option value="purchase">Purchase / Restock</option>
                  <option value="return_in">Customer Return</option>
                  <option value="adjustment">Inventory Count Adjustment</option>
                </>
              ) : (
                <>
                  <option value="adjustment">Inventory Count Adjustment</option>
                  <option value="return_out">Return to Supplier</option>
                </>
              )}
            </select>
          </div>

          {/* Unit Cost (for additions) */}
          {adjustmentType === "add" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit Cost (₦) - Optional
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitCost ?? ""}
                onChange={(e) => setUnitCost(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                placeholder={product.cost_price?.toString() ?? "0.00"}
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              placeholder="Reason for adjustment..."
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Current Stock:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {product.quantity_in_stock} {product.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">Adjustment:</span>
              <span className={`font-medium ${adjustmentType === "add" ? "text-brand-jade" : "text-red-500"}`}>
                {adjustmentType === "add" ? "+" : "-"}{quantity} {product.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300 font-medium">New Stock:</span>
              <span className={`font-bold text-lg ${newStock < 0 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                {newStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={adjustStock.isPending}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adjustStock.isPending || quantity <= 0 || newStock < 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                adjustmentType === "add"
                  ? "bg-brand-jade hover:bg-brand-jadeHover"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {adjustStock.isPending ? "Saving..." : "Confirm Adjustment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
