"use client";

import { useState } from "react";
import { Package, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  InventorySummaryCards,
  LowStockAlertsList,
  ProductList,
  ProductForm,
  StockAdjustmentModal,
  CategoryManager,
} from "@/features/inventory";
import type { Product } from "@/features/inventory";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { hasPlanFeature, type PlanTier } from "@/constants/pricing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CurrentUser = components["schemas"]["UserOut"];

export default function InventoryPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Fetch current user to check plan
  const { data: user, isLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const userPlan = (user?.plan?.toUpperCase() || "FREE") as PlanTier;
  const hasInventoryAccess = hasPlanFeature(userPlan, "INVENTORY");

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-jade" />
      </div>
    );
  }

  // Show upgrade prompt for users without access
  if (!hasInventoryAccess) {
    return (
      <div className="space-y-6">
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

        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-brand-border bg-white dark:bg-gray-900 p-8 text-center">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Inventory Management requires Pro plan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Upgrade to Pro or Business to unlock inventory management, track stock levels,
            and get low-stock alerts for your products.
          </p>
          <Link href="/dashboard/settings">
            <Button className="bg-brand-jade hover:bg-brand-jade/90 text-white">
              Upgrade to Pro - ₦8,000/month
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSelectProduct = (product: Product) => {
    // Open stock adjustment modal
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
        <div className="lg:col-span-2 space-y-6">
          <ProductList
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Sidebar - Categories & Low Stock Alerts */}
        <div className="space-y-6">
          <CategoryManager />
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
