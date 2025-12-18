import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/register-form";

function RegisterFormFallback() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-10 shadow-xl animate-pulse">
      <div className="space-y-2 text-center">
        <div className="h-8 bg-slate-200 rounded w-48 mx-auto" />
        <div className="h-4 bg-slate-100 rounded w-64 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-green-200 rounded" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 p-8">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <Suspense fallback={<RegisterFormFallback />}>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
