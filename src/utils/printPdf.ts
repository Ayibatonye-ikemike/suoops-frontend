/**
 * Open a PDF in a new tab so the user can print it via the browser's built-in
 * PDF viewer. The viewer's print button sends only the PDF content to the
 * connected printer — never the surrounding dashboard chrome.
 *
 * We deliberately avoid the hidden-iframe `contentWindow.print()` trick: on
 * Safari/iOS and some Chromium variants, calling `print()` on a cross-origin
 * iframe falls back to printing the parent document, which is exactly the
 * bug we're trying to avoid.
 */
export function printPdf(url: string): void {
  if (typeof window === "undefined" || !url) return;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    // Popup blocked — navigate the current tab as a last resort.
    window.location.href = url;
  }
}
