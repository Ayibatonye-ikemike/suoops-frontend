"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateProfile } from "@/api/user";

interface ProfileSectionProps {
  currentName?: string;
}

export function ProfileSection({ currentName }: ProfileSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName || "");

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Name updated successfully!");
      setIsEditing(false);
      // Invalidate user query to refresh all user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || error.message || "Failed to update name";
      toast.error(message);
    },
  });

  const handleSave = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (trimmedName.length > 120) {
      toast.error("Name must be less than 120 characters");
      return;
    }

    updateMutation.mutate({ name: trimmedName });
  };

  const handleCancel = () => {
    setName(currentName || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-textMuted mb-1.5">
        Full Name
      </label>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            disabled={updateMutation.isPending}
            className="flex-1 rounded-lg border border-brand-border/60 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-textMuted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
            autoFocus
          />
          
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="rounded-lg bg-brand-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={updateMutation.isPending}
            className="rounded-lg border border-brand-border/60 bg-brand-card px-3 py-2 text-sm font-medium text-brand-textMuted transition hover:bg-brand-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-brand-border/60 bg-brand-card px-3 py-2 text-sm text-brand-text">
            {currentName || "No name set"}
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-brand-border/60 bg-brand-card px-3 py-2 text-sm font-medium text-brand-textMuted transition hover:bg-brand-border/20 hover:text-brand-text"
            title="Edit name"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <p className="mt-2 text-xs text-brand-textMuted">
        Your name appears on invoices and team communications
      </p>
    </div>
  );
}
