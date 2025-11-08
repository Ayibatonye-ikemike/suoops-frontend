"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";

import { apiClient } from "@/api/client";
import type { components } from "@/api/types";

type CurrentUser = components["schemas"]["UserOut"];

const getErrorMessage = (err: unknown, fallback: string) => {
  if (isAxiosError(err)) {
    return err.response?.data?.detail || err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  return fallback;
};

export function LogoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
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
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err, "Failed to upload logo"));
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
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err, "Failed to remove logo"));
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
          <div className="h-32 w-32 rounded-lg bg-brand-accentMuted/60" />
          <div className="h-10 w-full rounded bg-brand-accentMuted/60" />
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-brand-primary/70">Unable to load logo settings.</p>
      </div>
    );
  }

  const currentLogo = user?.logo_url;
  const displayLogo = previewUrl || currentLogo;

  return (
    <div className="space-y-4">
      {/* Current/Preview Logo */}
      {displayLogo && (
        <div className="flex items-center gap-4 text-brand-primary">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-brand-accentMuted bg-brand-accent p-2">
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
            <p className="text-sm font-medium text-brand-primary/80">
              {previewUrl ? "Preview" : "Current Logo"}
            </p>
            <p className="text-xs text-brand-primary/60">
              This logo will appear on all your invoices and receipts
            </p>
          </div>
          {currentLogo && !previewUrl && (
            <button
              onClick={handleRemove}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </button>
          )}
        </div>
      )}

      {/* Upload Section */}
      {!currentLogo || previewUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="logo-upload"
              className="cursor-pointer rounded-lg border border-brand-accentMuted bg-brand-accent px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-accentMuted/40"
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
              <span className="text-sm text-brand-primary/70">{selectedFile.name}</span>
            )}
          </div>

          {previewUrl && (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-accent shadow-md transition hover:bg-brand-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Logo"}
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setError("");
                }}
                className="rounded-lg border border-brand-accentMuted bg-brand-accent px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-accentMuted/40"
              >
                Cancel
              </button>
            </div>
          )}

          <p className="text-xs text-brand-primary/60">
            Accepted formats: PNG, JPG, JPEG, SVG • Max size: 5MB • Recommended: Square logo,
            minimum 200x200px
          </p>
        </div>
      ) : (
        <label
          htmlFor="logo-upload-replace"
          className="inline-block cursor-pointer rounded-lg border border-brand-accentMuted bg-brand-accent px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-accentMuted/40"
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
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          ✓ Logo uploaded successfully!
        </div>
      )}

      {deleteMutation.isSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          ✓ Logo removed successfully
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
