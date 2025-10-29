"use client";

import { useEffect, type ReactNode } from "react";

import { initializeAuth } from "./auth-store";

let bootstrapped = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!bootstrapped) {
      bootstrapped = true;
      void initializeAuth();
    }
  }, []);

  return <>{children}</>;
}
