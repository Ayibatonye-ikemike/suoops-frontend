/**
 * Clipboard + file-save helpers that work across browsers — notably iOS Safari,
 * which ignores the `<a download>` attribute for `data:` URIs and can block the
 * async Clipboard API. Import these instead of hand-rolling copy/download.
 */

/**
 * Copy `text` to the clipboard. Tries the async Clipboard API first, then falls
 * back to a hidden `<textarea>` + `execCommand("copy")` for browsers/contexts
 * where the async API is unavailable or blocked. Returns whether it succeeded.
 */
export async function copyText(text: string): Promise<boolean> {
  if (!text || typeof navigator === "undefined") return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  if (typeof document === "undefined") return false;
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64 = ""] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(head)?.[1] ?? "image/png";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Save an image `data:` URL as a file. iOS Safari ignores `<a download>` for
 * data URIs, so we convert to a Blob and either invoke the native share sheet
 * (mobile — gives a "Save Image" option) or trigger an object-URL download
 * (desktop/Android). Falls back to opening the image in a new tab.
 */
export async function downloadDataUrl(
  dataUrl: string,
  filename: string,
  shareTitle?: string,
): Promise<void> {
  if (!dataUrl || typeof window === "undefined") return;

  let blob: Blob;
  try {
    blob = dataUrlToBlob(dataUrl);
  } catch {
    window.open(dataUrl, "_blank");
    return;
  }

  // Mobile: native share sheet (iOS shows "Save Image"). Only if files are
  // actually shareable — otherwise fall through to a download.
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
  };
  if (typeof nav.share === "function") {
    const file = new File([blob], filename, { type: blob.type });
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: shareTitle });
        return;
      } catch {
        // user cancelled or share failed — fall through to a normal download
      }
    }
  }

  // Desktop / Android: programmatic object-URL download.
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    window.open(dataUrl, "_blank");
  }
}
