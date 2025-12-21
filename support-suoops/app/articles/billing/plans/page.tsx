import Link from "next/link";
import { ChevronRight, CreditCard, Clock, Check, Zap, Building2, Crown } from "lucide-react";

export default function PlansArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Subscription Plans</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <CreditCard className="h-3 w-3" />
              Billing
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              5 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Understanding Subscription Plans
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Choose the right plan for your business needs. Start free, upgrade as you grow.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-slate-600" />
              <h3 className="font-bold text-slate-900">Free</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">₦0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>5 invoices/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>PDF downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Basic reports</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-xl border-2 border-emerald-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Pro</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">₦2,500</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span><strong>100 invoices</strong>/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Expense tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Tax calculations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          {/* Business Plan */}
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Business</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">₦7,500</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span><strong>Unlimited</strong> invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Team access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Inventory management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Advanced analytics</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>Invoice Packs (Pay-As-You-Go)</h2>
          <p>
            Need more invoices without committing to a monthly plan? Purchase invoice packs:
          </p>
          <ul>
            <li><strong>100 invoices</strong> for ₦2,500 (no expiry)</li>
            <li>Works on any plan, including Free</li>
            <li>Invoices never expire - use them anytime</li>
          </ul>

          <h2>How to Upgrade</h2>
          <ol>
            <li>Go to <strong>Dashboard → Settings → Subscription</strong></li>
            <li>Click <strong>Upgrade</strong> on your preferred plan</li>
            <li>Complete payment via Paystack</li>
            <li>Your new plan activates immediately</li>
          </ol>

          <h2>Billing FAQ</h2>
          
          <h3>When am I charged?</h3>
          <p>
            Subscriptions are billed monthly on the same date you first subscribed. 
            For example, if you subscribe on December 15th, you&apos;ll be charged again on January 15th.
          </p>

          <h3>Can I cancel anytime?</h3>
          <p>
            Yes! Cancel from Settings → Subscription. You&apos;ll keep access until the end of your 
            billing period, then revert to the Free plan.
          </p>

          <h3>What happens to my data if I downgrade?</h3>
          <p>
            All your invoices and data are preserved. You just won&apos;t be able to create new 
            invoices beyond the Free tier limit until you upgrade again.
          </p>

          <h3>Do you offer refunds?</h3>
          <p>
            We offer a 14-day money-back guarantee on first subscriptions. Contact support 
            within 14 days of your first payment to request a refund.
          </p>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to upgrade?</h3>
          <p className="text-slate-600 mb-4">
            Start with Free and upgrade when you&apos;re ready. No commitment required.
          </p>
          <a
            href="https://suoops.com/dashboard/settings"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            View Plans in Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
