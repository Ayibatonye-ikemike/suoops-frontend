"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  ChevronRight,
  BookOpen,
  Zap,
  Shield
} from "lucide-react";

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics of SuoOps",
    icon: Zap,
    href: "/articles/getting-started",
    color: "bg-blue-500",
  },
  {
    title: "Invoicing",
    description: "Create and manage invoices",
    icon: FileText,
    href: "/articles/invoicing",
    color: "bg-emerald-500",
  },
  {
    title: "Billing & Subscriptions",
    description: "Plans, payments, and upgrades",
    icon: CreditCard,
    href: "/articles/billing",
    color: "bg-purple-500",
  },
  {
    title: "Referrals",
    description: "Earn rewards by referring others",
    icon: Users,
    href: "/articles/referrals",
    color: "bg-orange-500",
  },
  {
    title: "WhatsApp Bot",
    description: "Send invoices via WhatsApp",
    icon: MessageSquare,
    href: "/articles/whatsapp",
    color: "bg-green-500",
  },
  {
    title: "Account & Security",
    description: "Privacy, security, and settings",
    icon: Shield,
    href: "/articles/account",
    color: "bg-red-500",
  },
];

const popularArticles = [
  { title: "How to create your first invoice", href: "/articles/getting-started/first-invoice" },
  { title: "Understanding subscription plans", href: "/articles/billing/plans" },
  { title: "How to connect WhatsApp", href: "/articles/whatsapp/setup" },
  { title: "How referral rewards work", href: "/articles/referrals/how-it-works" },
  { title: "How to delete your account", href: "/articles/account/delete-account" },
  { title: "Adding bank details for payments", href: "/articles/getting-started/bank-details" },
];

export default function SupportHomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            How can we help you?
          </h1>
          <p className="mt-4 text-lg text-emerald-100">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Browse by Category
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-emerald-600">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                    Browse articles
                    <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Popular Articles</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularArticles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 hover:text-emerald-600">
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-2xl bg-slate-900 p-8 sm:p-12">
            <HelpCircle className="mx-auto h-12 w-12 text-emerald-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-2 text-slate-400">
              Our support team is here to help. Get in touch and we&apos;ll respond as soon as possible.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
