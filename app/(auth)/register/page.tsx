"use client";

import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <RegisterForm />
      </div>
    </main>
  );
}
