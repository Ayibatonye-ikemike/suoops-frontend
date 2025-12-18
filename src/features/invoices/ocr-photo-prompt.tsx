import Link from "next/link";

export function OcrPhotoPrompt() {
  return (
    <div className="rounded-2xl border border-brand-jade/20 bg-brand-jade/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h3 className="text-base font-semibold text-brand-jade">
              Create from Photo
            </h3>
          </div>
          <p className="mt-1 text-sm text-brand-textMuted">
            Take a photo of a receipt and AI will extract the details
            automatically
          </p>
        </div>
        <Link
          href="/dashboard/invoices/create-from-photo"
          className="whitespace-nowrap rounded-lg bg-brand-jade px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover"
        >
          Upload Photo
        </Link>
      </div>
    </div>
  );
}
