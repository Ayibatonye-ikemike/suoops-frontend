import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { Navigation, Footer } from "@/components/landing/layout";
import { AboutCTA } from "./about-cta";

export const metadata: Metadata = {
  title: "About — The operating system for African commerce",
  description:
    "SuoOps exists to end business by memory. We organize orders, payments, delivery, inventory, invoices, and expenses into one traceable system for every African business, big or small.",
};

const PILLARS = [
  {
    icon: "🛍️",
    title: "Commerce",
    body: "A shareable storefront, product discovery across shops, buyer-picked courier delivery nationwide, and a marketplace where buyers find and order from real African businesses.",
  },
  {
    icon: "⚙️",
    title: "Structure",
    body: "Invoicing, payments, orders, inventory, expenses and business insight — recorded in one workflow, not lost in memory or scattered across tools.",
  },
  {
    icon: "🛡️",
    title: "Trust",
    body: "Buyer protection holds every payment safely until the order arrives, with disputes and reviews — confidence for buyers and sellers alike.",
  },
];

const FLOW = [
  "Discover",
  "Buy",
  "Pay",
  "Fulfil",
  "Manage",
  "Grow",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-evergreen">
      <Navigation />

      {/* Hero */}
      <section className="bg-brand-evergreen px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-jade/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-citrus">
            About SuoOps
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            SuoOps exists to end business by memory
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Orders buried in chats. Payments reduced to screenshots. Inventory
            tracked in notebooks. Customers lost in scattered conversations.
            We believe every business deserves a better way.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-brand-mint px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-brand-teal/10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-jade">
              Our Vision
            </h2>
            <p className="mt-4 font-heading text-2xl font-bold text-brand-evergreen">
              Every business deserves structure, visibility, trust, and control —
              whether big or small.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-brand-teal/10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-jade">
              Our Mission
            </h2>
            <p className="mt-4 font-heading text-2xl font-bold text-brand-evergreen">
              Bring the records that power commerce out of memory, screenshots,
              notebooks, and scattered chats into one organized, traceable system.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars: Commerce · Operations · Trust */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-evergreen sm:text-4xl">
              Commerce · Structure · Trust
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-charcoal/70">
              Most tools solve one piece of the workflow. SuoOps brings commerce
              together so your business is visible, traceable, and trusted by default.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl bg-brand-mint p-8 ring-1 ring-brand-teal/10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-jade/10 text-2xl">
                  {p.icon}
                </span>
                <h3 className="mt-5 text-xl font-bold text-brand-evergreen">
                  {p.title}
                </h3>
                <p className="mt-3 text-brand-charcoal/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commerce flow */}
      <section className="bg-brand-mint px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-heading text-3xl font-bold text-brand-evergreen sm:text-4xl">
            One flow, from discovery to growth
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-charcoal/70">
            SuoOps covers the entire commerce journey for both sides of the sale.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-evergreen shadow-sm ring-1 ring-brand-teal/10">
                  {step}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-brand-jade" aria-hidden>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-liner + CTA */}
      <section className="bg-brand-evergreen px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-2xl font-semibold leading-snug sm:text-3xl">
            Stop relying on what you remember. Build your business on records you
            can see, transactions you can trace, and commerce people can trust.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Suspense
              fallback={
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-jade px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-teal"
                >
                  Start selling free
                </Link>
              }
            >
              <AboutCTA />
            </Suspense>
            <Link
              href="/stores"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/15"
            >
              Browse the marketplace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
