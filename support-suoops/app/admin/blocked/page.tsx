import { ShieldAlert } from "lucide-react";

export default function AdminBlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Access restricted</h1>
        <p className="mt-3 text-sm text-slate-500">
          The SuoOps admin panel can only be reached from approved networks. Your current
          network is not on the allowlist.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          If you should have access, contact a super admin to add your IP address, or connect
          from an approved network.
        </p>
      </div>
    </div>
  );
}
