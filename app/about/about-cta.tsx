"use client";

import Link from "next/link";

import { useRegisterHref } from "@/hooks/use-tracking-params";

export function AboutCTA() {
  const registerHref = useRegisterHref();
  return (
    <Link
      href={registerHref}
      className="inline-flex items-center justify-center rounded-lg bg-brand-jade px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-teal"
    >
      Start selling free
    </Link>
  );
}
