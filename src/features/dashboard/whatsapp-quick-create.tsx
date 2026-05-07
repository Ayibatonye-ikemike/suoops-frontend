"use client";

import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { apiClient } from "@/api/client";
import { components } from "@/api/types.generated";
import { WhatsAppVerificationModal } from "@/features/settings/whatsapp-verification-modal";

type CurrentUser = components["schemas"]["UserOut"];

// SuoOps WhatsApp bot
export const SUOOPS_BOT_NUMBER = "2348106865807";
export const SUOOPS_BOT_LINK = `https://wa.me/${SUOOPS_BOT_NUMBER}?text=${encodeURIComponent(
  "Hi, I want to create an invoice",
)}`;

interface Props {
  className?: string;
  /** Render-prop so callers can supply their own button styling. */
  children: (props: {
    onClick: () => void;
    href?: string;
    target?: string;
    rel?: string;
  }) => ReactNode;
}

/**
 * Shared launcher for the "create via WhatsApp" flow — our headline
 * differentiator. Verified users go straight to the bot; unverified
 * users land in the verification modal first.
 *
 * Always render via render-prop so we can reuse the same auth/routing
 * logic across the hero, top nav, mobile bottom-bar and drawers.
 */
export function WhatsAppQuickCreate({ children }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const verified = Boolean(user?.phone_verified && user?.phone);

  return (
    <>
      <WhatsAppVerificationModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {verified
        ? children({
            href: SUOOPS_BOT_LINK,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: () => {},
          })
        : children({ onClick: () => setShowModal(true) })}
    </>
  );
}

WhatsAppQuickCreate.Icon = MessageCircle;
