"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ExternalLink, Settings } from "lucide-react";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types";
import Link from "next/link";

type CurrentUser = components["schemas"]["UserOut"];

// WhatsApp bot number for SuoOps
const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

export function WhatsAppTip() {
  // Fetch current user to check if phone is verified
  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const hasVerifiedPhone = user?.phone_verified && user?.phone;

  // User has verified WhatsApp - link directly to bot
  if (hasVerifiedPhone) {
    return (
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 transition-colors hover:bg-emerald-100 hover:border-emerald-400 group"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-800">
            Create via WhatsApp
          </p>
          <p className="text-xs text-emerald-600 truncate">
            Text: &quot;Invoice John 50k for design&quot;
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-emerald-500 group-hover:text-emerald-700 shrink-0" />
      </a>
    );
  }

  // User hasn't verified - link to settings
  return (
    <Link
      href="/dashboard/settings#whatsapp"
      className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 transition-colors hover:bg-blue-100 hover:border-blue-300 group"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shrink-0">
        <Settings className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-800">
          Set up WhatsApp invoicing
        </p>
        <p className="text-xs text-blue-600">
          Connect your number to create invoices via chat
        </p>
      </div>
      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded shrink-0">
        Set up →
      </span>
    </Link>
  );
}
