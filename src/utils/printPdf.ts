/**
 * Print a PDF document.
 *
 * Strategy:
 *  1. Try a hidden same-origin iframe and call `contentWindow.print()` so the
 *     browser's print dialog opens with the PDF as its source. This works for
 *     same-origin PDFs and produces a single-page printout containing only
 *     the document.
 *  2. If the iframe is cross-origin (e.g. an S3 URL), `contentWindow.print()`
 *     throws a SecurityError. In that case we open the PDF in a new tab so
 *     the browser's built-in PDF viewer can print it directly via its own
 *     toolbar — again, only the PDF content is sent to the printer.
 *
 * We deliberately NEVER fall back to `window.print()` on the parent page,
 * because that would print the surrounding dashboard chrome.
 */
export function printPdf(url: string): void {
  if (typeof window === "undefined" || !url) return;

  const openInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Reuse a single hidden iframe across calls to avoid leaking nodes.
  const IFRAME_ID = "__suoops_print_frame__";
  let iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement | null;

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
  }

  let printed = false;
  let timer: number | undefined;

  const cleanup = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    cleanup();
    try {
      const cw = iframe?.contentWindow;
      if (!cw) {
        openInNewTab();
        return;
      }
      cw.focus();
      cw.print();
    } catch {
      // Cross-origin PDF (e.g. S3) → fall back to opening the PDF directly
      // in the browser's PDF viewer where the user can print it. Crucially,
      // we do NOT call window.print() here — that would print this dashboard.
      openInNewTab();
    }
  };

  // Safety fallback in case `load` never fires (network error, blocked, etc.)
  timer = window.setTimeout(() => {
    if (!printed) {
      printed = true;
      openInNewTab();
    }
  }, 4000);

  iframe.onload = () => {
    // Small delay lets the PDF viewer initialise before printing.
    window.setTimeout(triggerPrint, 250);
  };

  iframe.src = url;
}
