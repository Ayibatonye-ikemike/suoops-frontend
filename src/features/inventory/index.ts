/**
 * Inventory feature module exports.
 * 
 * Provides components and hooks for inventory management.
 */

// Types
export * from "./types";

// Hooks
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useStockMovements,
  useAdjustStock,
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useInventorySummary,
  useLowStockAlerts,
  inventoryKeys,
} from "./use-inventory";

// Components
export { InventorySummaryCards, LowStockAlertsList } from "./inventory-summary";
export { ProductList } from "./product-list";
export { ProductForm } from "./product-form";
export { StockAdjustmentModal } from "./stock-adjustment-modal";
