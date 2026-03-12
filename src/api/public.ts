import { getConfig } from "@/lib/config";

const { apiBaseUrl } = getConfig();

export interface PublicTestimonial {
  id: number;
  text: string;
  rating: number;
  user_name: string;
  business_name: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface TopUser {
  business_name: string;
  logo_url: string | null;
  what_they_sell: string | null;
  invoices_sent: number;
  member_since: string;
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  const res = await fetch(`${apiBaseUrl}/public/testimonials`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getPublicTopUsers(): Promise<TopUser[]> {
  const res = await fetch(`${apiBaseUrl}/public/top-users`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}
