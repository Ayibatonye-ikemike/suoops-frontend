interface StatusBannerProps {
  isConfigured: boolean;
  hasChanges: boolean;
  isPending: boolean;
}

export function StatusBanner({
  isConfigured,
  hasChanges,
  isPending,
}: StatusBannerProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 ${
        isConfigured
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>
          {isConfigured ? "✅" : "⚠️"}
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-text">
            {isConfigured
              ? "Bank details configured"
              : "Bank details incomplete"}
          </p>
          <p className="mt-1 text-xs text-brand-textMuted">
            {isConfigured
              ? "New invoices already include your transfer instructions."
              : "Fill out every field and save to show transfer instructions on invoices."}
          </p>
          {hasChanges && !isPending && (
            <p className="mt-2 text-xs font-medium text-amber-700">
              You have unsaved changes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
