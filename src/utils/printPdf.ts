/**
 * Print a PDF (or any printable URL) silently via a hidden iframe.
 *
 * This triggers the browser's native print dialog, which routes to whichever
 * printer the user has connected (USB, network, AirPrint, etc.) without
 * requiring them to first open the PDF in a new tab and hit Cmd/Ctrl+P.
 *
 * Falls back to opening the URL in a new tab if the iframe approach is
 * blocked (e.g. by cross-origin restrictions on the PDF host).
 */
export function printPdf(url: string): void {
  if (typeof window === "undefined" || !url) return;

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
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    try {
      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    } catch {
      // Cross-origin or other failure → fallback to opening in a new tab.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Safety fallback in case `load` never fires (e.g. blocked).
  const fallbackTimer = window.setTimeout(triggerPrint, 4000);

  iframe.onload = () => {
    window.clearTimeout(fallbackTimer);
    // Small delay lets the PDF viewer initialise before printing.
    window.setTimeout(triggerPrint, 250);
  };

  iframe.src = url;
}

/**
 * Print the current page using the browser's print dialog. Use this when no
 * PDF URL is available; combine with the `@media print` rules in globals.css
 * to produce a clean printable layout.
 */
export function printCurrentPage(): void {
  if (typeof window === "undefined") return;
  window.print();
}
