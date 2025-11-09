interface MessageDisplayProps {
  successMessage?: string;
  updateError?: string | null;
  deleteError?: string | null;
}

export function MessageDisplay({
  successMessage,
  updateError,
  deleteError,
}: MessageDisplayProps) {
  return (
    <>
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {updateError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {updateError}
        </div>
      )}

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {deleteError}
        </div>
      )}
    </>
  );
}
