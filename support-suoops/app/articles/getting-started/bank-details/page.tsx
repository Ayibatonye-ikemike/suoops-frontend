import Link from "next/link";
import { ChevronRight, Building2, Clock, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

export default function BankDetailsArticle() {
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
          <span className="text-slate-900">Bank Details</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <Building2 className="h-3 w-3" />
              Getting Started
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              3 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Adding Bank Details for Payments
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Set up your bank account so customers can pay you directly via bank transfer.
          </p>
        </div>

        {/* Important Note */}
        <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Why This Matters</h3>
              <p className="text-sm text-amber-800">
                Your bank details appear on invoices so customers know where to send payments. 
                Without this, customers won&apos;t see payment instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>How to Add Bank Details</h2>
          
          <div className="not-prose my-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Go to Settings</h4>
                  <p className="text-sm text-slate-600">
                    Log in to your dashboard and click on <strong>Settings</strong> in the sidebar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Find Bank Details Section</h4>
                  <p className="text-sm text-slate-600">
                    Scroll down to the <strong>Bank Details</strong> section on the settings page.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Enter Your Details</h4>
                  <p className="text-sm text-slate-600">
                    Fill in your bank name, account number, and account name exactly as it appears on your bank statement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Save Changes</h4>
                  <p className="text-sm text-slate-600">
                    Click <strong>Save Bank Details</strong>. Your information will now appear on all invoices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2>Supported Banks</h2>
          <p>
            SuoOps supports all Nigerian banks including:
          </p>
          <ul>
            <li>Access Bank</li>
            <li>First Bank of Nigeria</li>
            <li>GTBank (Guaranty Trust Bank)</li>
            <li>UBA (United Bank for Africa)</li>
            <li>Zenith Bank</li>
            <li>And 20+ more Nigerian banks</li>
          </ul>

          <h2>What Customers See</h2>
          <p>
            When you send an invoice, customers will see your bank details in:
          </p>
          <ul>
            <li>The invoice PDF document</li>
            <li>The online payment page</li>
            <li>WhatsApp payment messages</li>
          </ul>

          <div className="not-prose my-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-900">Pro Tip</h4>
                <p className="text-sm text-emerald-800">
                  Double-check your account number before saving. Incorrect details mean customers 
                  might send payments to the wrong account.
                </p>
              </div>
            </div>
          </div>

          <h2>Troubleshooting</h2>
          
          <h3>Bank details not showing on invoices?</h3>
          <p>
            Make sure you&apos;ve saved your bank details in Settings. If you just added them, 
            you may need to refresh the invoice or create a new one.
          </p>

          <h3>Customer says they can&apos;t see payment info?</h3>
          <p>
            First-time customers need to reply to the WhatsApp notification before seeing full 
            payment details. This is for security and compliance with WhatsApp policies.
          </p>
        </article>

        {/* Related Articles */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="grid gap-3">
            <Link 
              href="/articles/getting-started/first-invoice" 
              className="flex items-center gap-2 text-emerald-600 hover:underline"
            >
              <CreditCard className="h-4 w-4" />
              Creating your first invoice
            </Link>
            <Link 
              href="/articles/whatsapp/setup" 
              className="flex items-center gap-2 text-emerald-600 hover:underline"
            >
              <CreditCard className="h-4 w-4" />
              Setting up WhatsApp integration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
