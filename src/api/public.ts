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

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const res = await fetch(`${apiBaseUrl}/public/testimonials`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
