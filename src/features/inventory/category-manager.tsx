"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useCategories, useDeleteCategory } from "./use-inventory";
import { CategoryForm } from "./category-form";
import type { ProductCategory } from "./types";
import { toast } from "react-hot-toast";

export function CategoryManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  
  const { data: categories, isLoading } = useCategories(false);
  const deleteCategory = useDeleteCategory();

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: ProductCategory) => {
    if (!confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(category.id);
      toast.success("Category deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete category";
      toast.error(message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    toast.success(editingCategory ? "Category updated" : "Category created");
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Categories
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Organize your products into categories
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white hover:bg-brand-jade/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <div className="p-4">
          {!categories || categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                No categories yet. Create one to organize your products.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white hover:bg-brand-jade/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add First Category
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 hover:border-brand-jade transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="h-8 w-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: category.color ?? "#10b981" }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h4>
                      {category.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {category.description}
                        </p>
                      )}
                    </div>
                    {!category.is_active && (
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={deleteCategory.isPending}
                      className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
