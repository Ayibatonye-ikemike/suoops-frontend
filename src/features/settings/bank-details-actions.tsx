import { Button } from "@/components/ui/button";

interface ActionsProps {
  canClear: boolean;
  hasChanges: boolean;
  isFormValid: boolean;
  isDeleting: boolean;
  isSaving: boolean;
  onClear: () => void;
}

export function BankDetailsActions({
  canClear,
  hasChanges,
  isFormValid,
  isDeleting,
  isSaving,
  onClear,
}: ActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-brand-border/60 pt-6 text-brand-text sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-brand-textMuted">
        <span className="text-red-500">*</span> Required fields
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClear}
          disabled={!canClear || isDeleting}
          className="min-w-[160px]"
        >
          {isDeleting ? "Clearing" : "Clear Bank Details"}
        </Button>
        <Button
          type="submit"
          disabled={!hasChanges || !isFormValid || isSaving}
          className="min-w-[160px]"
        >
          {isSaving ? "Saving" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
