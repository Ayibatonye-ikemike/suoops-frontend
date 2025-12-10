"use client";

import { useState } from "react";
import { Plus, Search, Package, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useProducts, useCategories, useDeleteProduct } from "./use-inventory";
import type { Product } from "./types";

interface ProductListProps {
  onSelectProduct?: (product: Product) => void;
  onCreateProduct?: () => void;
  onEditProduct?: (product: Product) => void;
}

export function ProductList({ onSelectProduct, onCreateProduct, onEditProduct }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: categories } = useCategories();
  const { data: productData, isLoading } = useProducts({
    page,
    page_size: pageSize,
    search: search || undefined,
    category_id: categoryFilter,
    low_stock_only: stockFilter === "low",
    out_of_stock_only: stockFilter === "out",
  });

  const deleteProduct = useDeleteProduct();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);

  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct.mutate(product.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products</h2>
        {onCreateProduct && (
          <button
            onClick={onCreateProduct}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-jadeHover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or barcode..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
          />
        </div>

        <select
          value={categoryFilter ?? ""}
          onChange={(e) => {
            setCategoryFilter(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count})
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value as typeof stockFilter);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
        >
          <option value="all">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-jade border-t-transparent" />
          </div>
        ) : !productData?.products.length ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>No products found</p>
            {onCreateProduct && (
              <button
                onClick={onCreateProduct}
                className="mt-4 text-brand-jade hover:underline"
              >
                Add your first product
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">SKU</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Price</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Stock</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Value</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {productData.products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      onClick={() => onSelectProduct?.(product)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                            {product.barcode && (
                              <p className="text-xs text-gray-500">{product.barcode}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono text-sm">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3">
                        {product.category_name ? (
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                            {product.category_name}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-medium">
                        {formatCurrency(product.selling_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {product.is_out_of_stock ? (
                            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                              <AlertTriangle className="h-4 w-4" />
                              Out
                            </span>
                          ) : product.is_low_stock ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                              <AlertTriangle className="h-4 w-4" />
                              {product.quantity_in_stock} {product.unit}
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-white font-medium">
                              {product.quantity_in_stock} {product.unit}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                        {product.stock_value != null ? formatCurrency(product.stock_value) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {onEditProduct && (
                            <button
                              onClick={() => onEditProduct(product)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-jade hover:bg-brand-jade/10 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {productData.total_pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, productData.total)} of {productData.total} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {productData.total_pages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === productData.total_pages}
                    className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
