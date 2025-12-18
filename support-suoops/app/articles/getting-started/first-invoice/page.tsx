import Link from "next/link";
import { ChevronRight, Zap, Clock, CheckCircle2 } from "lucide-react";

export default function FirstInvoiceArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles/getting-started" className="hover:text-emerald-600">Getting Started</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">First Invoice</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              <Zap className="h-3 w-3" />
              Getting Started
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              3 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            How to Create Your First Invoice
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Learn how to create and send your first professional invoice in just a few minutes.
          </p>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>Overview</h2>
          <p>
            Creating an invoice in SuoOps is quick and easy. You can create invoices from your 
            dashboard and send them directly to your customers via WhatsApp or email.
          </p>

          <h2>Step-by-Step Guide</h2>
          
          <h3>Step 1: Go to Dashboard</h3>
          <p>
            After logging in, you&apos;ll be taken to your dashboard. Click the <strong>&quot;Create Invoice&quot;</strong> 
            button in the top right corner.
          </p>

          <h3>Step 2: Add Customer Details</h3>
          <p>
            Enter your customer&apos;s information:
          </p>
          <ul>
            <li><strong>Customer Name</strong> - The name of your customer or their business</li>
            <li><strong>Phone Number</strong> - For WhatsApp delivery (optional)</li>
            <li><strong>Email</strong> - For email delivery (optional)</li>
          </ul>

          <h3>Step 3: Add Line Items</h3>
          <p>
            Add the products or services you&apos;re invoicing for:
          </p>
          <ul>
            <li><strong>Description</strong> - What you&apos;re charging for</li>
            <li><strong>Quantity</strong> - How many units</li>
            <li><strong>Unit Price</strong> - Price per unit in Naira (₦)</li>
          </ul>
          <p>
            You can add multiple line items to a single invoice.
          </p>

          <h3>Step 4: Review and Send</h3>
          <p>
            Review your invoice total and click <strong>&quot;Create Invoice&quot;</strong>. You&apos;ll then have 
            the option to:
          </p>
          <ul>
            <li>Send via WhatsApp</li>
            <li>Send via Email</li>
            <li>Download as PDF</li>
            <li>Copy the invoice link</li>
          </ul>

          <h2>Tips for Your First Invoice</h2>
          <div className="not-prose my-6 space-y-3">
            {[
              "Add your bank details in Settings so customers know where to pay",
              "Upload your business logo for professional-looking invoices",
              "Use clear, descriptive line item descriptions",
              "Set a due date to help track overdue payments",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <span className="text-sm text-emerald-800">{tip}</span>
              </div>
            ))}
          </div>

          <h2>What Happens Next?</h2>
          <p>
            Once you create an invoice:
          </p>
          <ul>
            <li>It appears in your invoice list with &quot;Pending&quot; status</li>
            <li>Your customer receives it via their preferred channel</li>
            <li>They can view, verify, and pay using the invoice link</li>
            <li>You can mark it as paid once payment is received</li>
          </ul>

          <h2>Need More Help?</h2>
          <p>
            If you&apos;re having trouble creating invoices, check our <Link href="/faq">FAQ</Link> or 
            <Link href="/contact"> contact our support team</Link>.
          </p>
        </article>

        {/* Related Articles */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="space-y-3">
            <Link href="/articles/getting-started/bank-details" className="block text-sm text-emerald-600 hover:underline">
              → Adding bank details for payments
            </Link>
            <Link href="/articles/invoicing/send-invoice" className="block text-sm text-emerald-600 hover:underline">
              → Sending invoices via WhatsApp or Email
            </Link>
            <Link href="/articles/invoicing/track-payments" className="block text-sm text-emerald-600 hover:underline">
              → Tracking payment status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
