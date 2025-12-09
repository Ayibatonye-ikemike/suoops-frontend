"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateProduct, useUpdateProduct, useCategories } from "./use-inventory";
import type { Product, ProductCreate, ProductUpdate } from "./types";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<ProductCreate>({
    sku: product?.sku ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    barcode: product?.barcode ?? "",
    category_id: product?.category_id ?? undefined,
    cost_price: product?.cost_price ?? undefined,
    selling_price: product?.selling_price ?? 0,
    quantity_in_stock: product?.quantity_in_stock ?? 0,
    reorder_level: product?.reorder_level ?? 10,
    reorder_quantity: product?.reorder_quantity ?? 20,
    unit: product?.unit ?? "pcs",
    track_stock: product?.track_stock ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        const updates: ProductUpdate & { id: number } = {
          id: product.id,
          ...formData,
        };
        await updateProduct.mutateAsync(updates);
      } else {
        await createProduct.mutateAsync(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      // Try to extract detail from axios error
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } };
        setError(axiosErr.response?.data?.detail ?? message);
      } else {
        setError(message);
      }
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                placeholder="PROD-001"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Barcode
              </label>
              <input
                type="text"
                value={formData.barcode ?? ""}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value || null })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description ?? ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category_id ?? ""}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
            >
              <option value="">No category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost Price (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price ?? ""}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selling Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity_in_stock}
                onChange={(e) => setFormData({ ...formData, quantity_in_stock: Number(e.target.value) })}
                disabled={isEditing}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Use stock adjustment</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reorder Level
              </label>
              <input
                type="number"
                min="0"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="L">Liters</option>
                <option value="ml">Milliliters</option>
                <option value="m">Meters</option>
                <option value="box">Boxes</option>
                <option value="pack">Packs</option>
                <option value="dozen">Dozens</option>
              </select>
            </div>
          </div>

          {/* Track Stock Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.track_stock}
              onChange={(e) => setFormData({ ...formData, track_stock: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-brand-jade focus:ring-brand-jade"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Track inventory for this product
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-brand-jade text-sm font-semibold text-white hover:bg-brand-jadeHover transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
