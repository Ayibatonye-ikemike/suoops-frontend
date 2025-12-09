"use client";

import { useState, useEffect, useCallback } from "react";
import { getTeamRole } from "@/api/team";
import type { components } from "@/api/types";

type UserTeamRole = components["schemas"]["UserTeamRole"];

interface UseTeamRoleResult {
  teamRole: UserTeamRole | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isAdmin: boolean;
  canAccessSettings: boolean;
  canEditInventory: boolean;
}

/**
 * Hook to check user's team role and permissions
 * 
 * Usage:
 * ```tsx
 * const { isAdmin, canAccessSettings, canEditInventory } = useTeamRole();
 * 
 * if (!canAccessSettings) {
 *   return <AccessDenied />;
 * }
 * ```
 */
export function useTeamRole(): UseTeamRoleResult {
  const [teamRole, setTeamRole] = useState<UserTeamRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeamRole = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeamRole();
      setTeamRole(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch team role"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamRole();
  }, [fetchTeamRole]);

  // Derive permissions
  const isAdmin = teamRole?.is_admin ?? true; // Default to admin for solo users
  const canAccessSettings = teamRole?.can_access_settings ?? true;
  const canEditInventory = teamRole?.can_edit_inventory ?? true;

  return {
    teamRole,
    loading,
    error,
    refresh: fetchTeamRole,
    isAdmin,
    canAccessSettings,
    canEditInventory,
  };
}

/**
 * Component to wrap content that requires admin access
 */
export function RequireAdmin({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isAdmin, loading } = useTeamRole();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
