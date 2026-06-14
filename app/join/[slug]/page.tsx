import { redirect } from "next/navigation";

/**
 * Vanity URL for influencer/affiliate signup links.
 * /join/coachade → /register?ref=coachade
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/register?ref=${encodeURIComponent(slug)}`);
}
