"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductListResponse,
  ProductCategory,
  ProductCategoryCreate,
  ProductCategoryUpdate,
  StockMovement,
  StockAdjustmentCreate,
  StockMovementListResponse,
  Supplier,
  SupplierCreate,
  SupplierUpdate,
  InventorySummary,
  LowStockAlert,
} from "./types";

// ============================================================================
// Query Keys
// ============================================================================

export const inventoryKeys = {
  all: ["inventory"] as const,
  products: () => [...inventoryKeys.all, "products"] as const,
  productList: (filters: Record<string, unknown>) => [...inventoryKeys.products(), filters] as const,
  productDetail: (id: number) => [...inventoryKeys.products(), id] as const,
  categories: () => [...inventoryKeys.all, "categories"] as const,
  movements: (filters?: Record<string, unknown>) => [...inventoryKeys.all, "movements", filters] as const,
  suppliers: () => [...inventoryKeys.all, "suppliers"] as const,
  summary: () => [...inventoryKeys.all, "summary"] as const,
  lowStock: () => [...inventoryKeys.all, "low-stock"] as const,
};

// ============================================================================
// Product API Functions
// ============================================================================

interface ProductFilters {
  [key: string]: unknown;
  page?: number;
  page_size?: number;
  category_id?: number;
  search?: string;
  include_inactive?: boolean;
  low_stock_only?: boolean;
  out_of_stock_only?: boolean;
}

async function fetchProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));
  if (filters.category_id) params.set("category_id", String(filters.category_id));
  if (filters.search) params.set("search", filters.search);
  if (filters.include_inactive) params.set("include_inactive", "true");
  if (filters.low_stock_only) params.set("low_stock_only", "true");
  if (filters.out_of_stock_only) params.set("out_of_stock_only", "true");

  const { data } = await apiClient.get<ProductListResponse>(`/inventory/products?${params}`);
  return data;
}

async function fetchProduct(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/inventory/products/${id}`);
  return data;
}

async function createProduct(product: ProductCreate): Promise<Product> {
  const { data } = await apiClient.post<Product>("/inventory/products", product);
  return data;
}

async function updateProduct({ id, ...updates }: ProductUpdate & { id: number }): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/inventory/products/${id}`, updates);
  return data;
}

async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/inventory/products/${id}`);
}

// ============================================================================
// Product Hooks
// ============================================================================

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: inventoryKeys.productList(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: inventoryKeys.productDetail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.products() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.summary() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.products() });
      queryClient.setQueryData(inventoryKeys.productDetail(product.id), product);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.products() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.summary() });
    },
  });
}

// ============================================================================
// Category API & Hooks
// ============================================================================

async function fetchCategories(includeInactive = false): Promise<ProductCategory[]> {
  const { data } = await apiClient.get<ProductCategory[]>(
    `/inventory/categories?include_inactive=${includeInactive}`
  );
  return data;
}

async function createCategory(category: ProductCategoryCreate): Promise<ProductCategory> {
  const { data } = await apiClient.post<ProductCategory>("/inventory/categories", category);
  return data;
}

async function updateCategory({ id, ...updates }: ProductCategoryUpdate & { id: number }): Promise<ProductCategory> {
  const { data } = await apiClient.patch<ProductCategory>(`/inventory/categories/${id}`, updates);
  return data;
}

async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/inventory/categories/${id}`);
}

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...inventoryKeys.categories(), { includeInactive }],
    queryFn: () => fetchCategories(includeInactive),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
    },
  });
}

// ============================================================================
// Stock Movement API & Hooks
// ============================================================================

interface MovementFilters {
  [key: string]: unknown;
  product_id?: number;
  movement_type?: string;
  page?: number;
  page_size?: number;
}

async function fetchMovements(filters: MovementFilters = {}): Promise<StockMovementListResponse> {
  const params = new URLSearchParams();
  if (filters.product_id) params.set("product_id", String(filters.product_id));
  if (filters.movement_type) params.set("movement_type", filters.movement_type);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));

  const { data } = await apiClient.get<StockMovementListResponse>(`/inventory/stock/movements?${params}`);
  return data;
}

async function adjustStock(adjustment: StockAdjustmentCreate): Promise<StockMovement> {
  const { data } = await apiClient.post<StockMovement>("/inventory/stock/adjust", adjustment);
  return data;
}

export function useStockMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: inventoryKeys.movements(filters),
    queryFn: () => fetchMovements(filters),
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adjustStock,
    onSuccess: (movement) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.products() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.movements() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.summary() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
      // Update specific product
      queryClient.invalidateQueries({ queryKey: inventoryKeys.productDetail(movement.product_id) });
    },
  });
}

// ============================================================================
// Supplier API & Hooks
// ============================================================================

async function fetchSuppliers(includeInactive = false): Promise<Supplier[]> {
  const { data } = await apiClient.get<Supplier[]>(
    `/inventory/suppliers?include_inactive=${includeInactive}`
  );
  return data;
}

async function createSupplier(supplier: SupplierCreate): Promise<Supplier> {
  const { data } = await apiClient.post<Supplier>("/inventory/suppliers", supplier);
  return data;
}

async function updateSupplier({ id, ...updates }: SupplierUpdate & { id: number }): Promise<Supplier> {
  const { data } = await apiClient.patch<Supplier>(`/inventory/suppliers/${id}`, updates);
  return data;
}

async function deleteSupplier(id: number): Promise<void> {
  await apiClient.delete(`/inventory/suppliers/${id}`);
}

export function useSuppliers(includeInactive = false) {
  return useQuery({
    queryKey: [...inventoryKeys.suppliers(), { includeInactive }],
    queryFn: () => fetchSuppliers(includeInactive),
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.suppliers() });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.suppliers() });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.suppliers() });
    },
  });
}

// ============================================================================
// Analytics Hooks
// ============================================================================

async function fetchInventorySummary(): Promise<InventorySummary> {
  const { data } = await apiClient.get<InventorySummary>("/inventory/analytics/summary");
  return data;
}

async function fetchLowStockAlerts(): Promise<LowStockAlert[]> {
  const { data } = await apiClient.get<LowStockAlert[]>("/inventory/analytics/low-stock");
  return data;
}

export function useInventorySummary() {
  return useQuery({
    queryKey: inventoryKeys.summary(),
    queryFn: fetchInventorySummary,
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: fetchLowStockAlerts,
  });
}
