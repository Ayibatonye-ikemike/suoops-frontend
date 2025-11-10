"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import { Button } from "@/components/ui/button";

type CurrentUser = components["schemas"]["UserOut"];

interface PlanFeatureError {
  error: string;
  message: string;
  current_plan: string;
  required_feature: string;
  upgrade_url: string;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    
    // Handle plan feature errors (object with message property)
    if (detail && typeof detail === 'object' && 'message' in detail) {
      return String(detail.message);
    }
    
    // Handle string detail
    if (typeof detail === 'string') {
      return detail;
    }
    
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  return fallback;
};

const isPlanFeatureError = (err: unknown): err is { response: { data: { detail: PlanFeatureError } } } => {
  if (!isAxiosError(err)) return false;
  const detail = err.response?.data?.detail;
  return detail && typeof detail === 'object' && 'upgrade_url' in detail;
};

export function LogoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [planError, setPlanError] = useState<PlanFeatureError | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading, error: userError } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: 60000, // 1 minute
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/users/me/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
      setPlanError(null);
    },
    onError: (err: unknown) => {
      if (isPlanFeatureError(err)) {
        setPlanError(err.response.data.detail);
        setError("");
      } else {
        setError(getErrorMessage(err, "Failed to upload logo"));
        setPlanError(null);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete("/users/me/logo");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
      setPlanError(null);
    },
    onError: (err: unknown) => {
      if (isPlanFeatureError(err)) {
        setPlanError(err.response.data.detail);
        setError("");
      } else {
        setError(getErrorMessage(err, "Failed to remove logo"));
        setPlanError(null);
      }
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a PNG, JPG, JPEG, or SVG file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setPlanError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleRemove = () => {
    if (
      typeof window === "undefined" ||
      window.confirm("Are you sure you want to remove your logo? It will no longer appear on invoices.")
    ) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 w-32 rounded-lg bg-brand-background" />
          <div className="h-10 w-full rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-brand-textMuted">Unable to load logo settings.</p>
      </div>
    );
  }

  const currentLogo = user?.logo_url;
  const displayLogo = previewUrl || currentLogo;

  return (
    <div className="space-y-4">
      {/* Current/Preview Logo */}
      {displayLogo && (
        <div className="flex items-center gap-4 text-brand-text">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-brand-border bg-white p-2">
            <Image
              src={displayLogo}
              alt="Business logo"
              fill
              sizes="96px"
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
              {previewUrl ? "Preview" : "Current Logo"}
            </p>
            <p className="mt-2 text-sm text-brand-text">
              This logo will appear on all your invoices and receipts
            </p>
          </div>
          {currentLogo && !previewUrl && (
            <Button
              onClick={handleRemove}
              disabled={deleteMutation.isPending}
              variant="danger"
              size="sm"
            >
              {deleteMutation.isPending ? "Removing" : "Remove"}
            </Button>
          )}
        </div>
      )}

      {/* Upload Section */}
      {!currentLogo || previewUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="logo-upload"
              className="cursor-pointer rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-text transition hover:bg-brand-background"
            >
              {previewUrl ? "Choose Different File" : "Choose File"}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile && (
              <span className="text-sm text-brand-textMuted">{selectedFile.name}</span>
            )}
          </div>

          {previewUrl && (
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="min-w-[140px]"
              >
                {uploadMutation.isPending ? "Uploading" : "Upload Logo"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setError("");
                  setPlanError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          <p className="text-xs text-brand-textMuted">
            Accepted formats: PNG, JPG, JPEG, SVG • Max size: 5MB • Recommended: Square logo,
            minimum 200x200px
          </p>
        </div>
      ) : (
        <label
          htmlFor="logo-upload-replace"
          className="inline-block cursor-pointer rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-text transition hover:bg-brand-background"
        >
          Replace Logo
          <input
            id="logo-upload-replace"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}

      {/* Success Message */}
      {uploadMutation.isSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          ✓ Logo uploaded successfully!
        </div>
      )}

      {deleteMutation.isSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          ✓ Logo removed successfully
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Plan Upgrade Required */}
      {planError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-amber-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                {planError.message}
              </p>
              <p className="mt-1 text-xs text-amber-700">
                You're currently on the <span className="font-semibold capitalize">{planError.current_plan}</span> plan.
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = planError.upgrade_url;
                }
              }}
              className="w-full sm:w-auto"
              size="sm"
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
