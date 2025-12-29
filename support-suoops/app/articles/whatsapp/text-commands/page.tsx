import Link from "next/link";
import { ChevronRight, MessageSquare, Clock, Zap, Copy } from "lucide-react";

export default function TextCommandsArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles/whatsapp" className="hover:text-emerald-600">WhatsApp</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Text Commands</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <MessageSquare className="h-3 w-3" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              2 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Create Invoices by Texting
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            The fastest way to invoice: just text what you sold. Suoops creates the invoice for you.
          </p>
        </div>

        {/* Quick Start Box */}
        <div className="mb-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-2">Quick Start</h3>
              <p className="text-sm text-emerald-800 mb-3">
                Send a message like this to the Suoops WhatsApp Bot:
              </p>
              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                <code className="text-sm text-slate-900">
                  Invoice John ₦50,000 for website design
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>How It Works</h2>
          <p>
            Instead of filling out forms, just text what you sold — like you&apos;re explaining it to a friend. 
            Suoops understands natural language and creates a professional invoice automatically.
          </p>

          <h2>Text Command Format</h2>
          <p>
            Start your message with <strong>&quot;Invoice&quot;</strong> followed by:
          </p>
          <ul>
            <li><strong>Customer name</strong> - Who you&apos;re billing</li>
            <li><strong>Amount</strong> - How much (with ₦ or NGN)</li>
            <li><strong>Description</strong> - What you sold or did</li>
          </ul>

          <h2>Examples That Work</h2>
          
          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Copy className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <code className="text-sm text-slate-900 block mb-1">
                    Invoice John ₦50k for design
                  </code>
                  <p className="text-xs text-slate-600">Simple and quick</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Copy className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <code className="text-sm text-slate-900 block mb-1">
                    Invoice Sarah ₦125,000 for 3 months social media management
                  </code>
                  <p className="text-xs text-slate-600">With detailed description</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Copy className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <code className="text-sm text-slate-900 block mb-1">
                    Invoice Mike NGN 80000 for branding package
                  </code>
                  <p className="text-xs text-slate-600">Works with NGN too</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Copy className="h-4 w-4 text-slate-400 mt-1" />
                <div>
                  <code className="text-sm text-slate-900 block mb-1">
                    Invoice Tunde ₦45k haircut and styling
                  </code>
                  <p className="text-xs text-slate-600">Service-based billing</p>
                </div>
              </div>
            </div>
          </div>

          <h2>What Happens Next?</h2>
          <ol>
            <li>Suoops instantly creates a professional invoice</li>
            <li>You get a preview with a link to view it</li>
            <li>You can send it to the customer or make edits first</li>
            <li>Customer receives it on WhatsApp with payment instructions</li>
          </ol>

          <h2>Tips for Better Results</h2>
          <ul>
            <li>Always start with &quot;Invoice&quot; so Suoops knows what you want</li>
            <li>Include the customer&apos;s name (first name works fine)</li>
            <li>Use ₦ or NGN before the amount</li>
            <li>Add &quot;k&quot; for thousands (₦50k = ₦50,000)</li>
            <li>Be clear about what you&apos;re charging for</li>
          </ul>

          <h2>Need More Control?</h2>
          <p>
            Text commands are fastest, but if you need to add:
          </p>
          <ul>
            <li>Multiple line items</li>
            <li>Discounts or taxes</li>
            <li>Due dates</li>
            <li>Customer email or phone</li>
          </ul>
          <p>
            You can use the <Link href="/articles/getting-started/first-invoice">dashboard to create detailed invoices</Link> or 
            use advanced WhatsApp commands (coming soon).
          </p>

          <h2>Common Questions</h2>
          
          <h3>Does it work for existing customers?</h3>
          <p>
            Yes! If you&apos;ve invoiced &quot;John&quot; before, Suoops remembers his details. 
            Just say &quot;Invoice John ₦50k&quot; and we&apos;ll use the saved contact info.
          </p>

          <h3>Can I edit the invoice after creating it?</h3>
          <p>
            Absolutely. You&apos;ll get a preview link where you can edit any details before sending 
            it to your customer.
          </p>

          <h3>What if I make a typo?</h3>
          <p>
            No problem! You can edit the invoice from the preview link, or just text again with 
            the correct information.
          </p>
        </article>

        {/* Next Steps */}
        <div className="mt-12 rounded-xl bg-slate-50 border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <Link 
              href="/articles/whatsapp/setup"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Connect WhatsApp to get started
            </Link>
            <Link 
              href="/articles/getting-started/bank-details"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Add bank details so customers can pay you
            </Link>
            <Link 
              href="/articles/invoicing"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Learn more about invoicing features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
