import { notFound } from "next/navigation";

/**
 * Visitors whose IP is not on the admin allowlist are rewritten here by the
 * Next middleware. We deliberately render the standard 404 (Not Found) page —
 * identical to any non-existent route — so the response gives no hint that an
 * admin panel exists or that an IP allowlist is in force.
 */
export default function AdminBlockedPage() {
  notFound();
}
