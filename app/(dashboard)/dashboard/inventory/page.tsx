"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import {
  InventorySummaryCards,
  LowStockAlertsList,
  ProductList,
  ProductForm,
  StockAdjustmentModal,
} from "@/features/inventory";
import type { Product } from "@/features/inventory";

export default function InventoryPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Could open a detail view or stock adjustment modal
    setAdjustingProduct(product);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-brand-jade/10">
          <Package className="h-6 w-6 text-brand-jade" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your products and stock levels
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <InventorySummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ProductList
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Sidebar - Low Stock Alerts */}
        <div className="space-y-6">
          <LowStockAlertsList />
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <StockAdjustmentModal
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
        />
      )}
    </div>
  );
}
