"use client";

import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import {
  useCreateProduct,
  useUpdateProduct,
  useCategories,
  useUploadProductImage,
} from "./use-inventory";
import { useCurrency } from "@/hooks/use-currency";
import type { Product, ProductCreate, ProductUpdate } from "./types";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEditing = !!product;
  const { symbol } = useCurrency();
  
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadProductImage();

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let productId = product?.id;
      if (isEditing) {
        const updates: ProductUpdate & { id: number } = {
          id: product.id,
          ...formData,
        };
        await updateProduct.mutateAsync(updates);
      } else {
        const created = await createProduct.mutateAsync(formData);
        productId = created.id;
      }
      if (imageFile && productId) {
        await uploadImage.mutateAsync({ id: productId, file: imageFile });
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

  const isLoading =
    createProduct.isPending || updateProduct.isPending || uploadImage.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit item" : "Add item"}
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

          {/* What are you adding? Drives the rest of the form. */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What are you adding?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, track_stock: true })}
                  className={`rounded-xl border-2 p-3 text-left transition ${
                    formData.track_stock
                      ? "border-brand-jade bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="text-xl">📦</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Product</div>
                  <div className="text-xs text-gray-500">Something you stock &amp; count</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, track_stock: false })}
                  className={`rounded-xl border-2 p-3 text-left transition ${
                    !formData.track_stock
                      ? "border-brand-jade bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="text-xl">🛠️</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Service</div>
                  <div className="text-xs text-gray-500">Freelance, digital — no stock</div>
                </button>
              </div>
            </div>
          )}

          {/* Name — the essential */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {formData.track_stock ? "Product name" : "Service name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              placeholder={
                formData.track_stock
                  ? "e.g. Bag of rice, Red handbag"
                  : "e.g. Logo design, Consulting (per hour), Website build"
              }
            />
          </div>

          {/* Price — the essential */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price ({symbol}) <span className="text-red-500">*</span>
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
            <p className="mt-1 text-xs text-gray-500">What you charge customers.</p>
          </div>

          {/* Photo (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Photo{" "}
              <span className="font-normal text-gray-400">
                (optional — shown on your storefront)
              </span>
            </label>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Item"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                {imagePreview ? "Change photo" : "Add photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Stock — only for products */}
          {formData.track_stock && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  How many in stock?
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
                  <p className="text-xs text-gray-500 mt-1">Use stock adjustment to change.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alert me at
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorder_level}
                  onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                />
                <p className="text-xs text-gray-500 mt-1">We&apos;ll remind you to restock.</p>
              </div>
            </div>
          )}

          {/* More options (optional) */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm font-medium text-brand-jade hover:underline"
            >
              {showAdvanced ? "Hide extra details" : "More options (optional)"}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 rounded-lg border border-gray-100 dark:border-gray-700 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                  placeholder="What's included, size, colour, etc."
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost price ({symbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_price ?? ""}
                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                    placeholder="What it costs you"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code / SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku ?? ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                    placeholder="Auto-generated if blank"
                  />
                </div>
              </div>

              {formData.track_stock && (
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
              )}
            </div>
          )}

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
              {isLoading ? "Saving..." : isEditing ? "Update item" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
