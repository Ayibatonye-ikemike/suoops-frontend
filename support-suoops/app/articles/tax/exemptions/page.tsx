import Link from "next/link";
import { ChevronRight, Calculator, Clock, AlertCircle, CheckCircle2, Shield } from "lucide-react";

export default function TaxExemptionsArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Tax Exemptions</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              <Calculator className="h-3 w-3" />
              Tax & Compliance
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              5 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Understanding Tax Exemptions (Under ₦25M)
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            If your annual revenue is under ₦25 million, you may qualify for tax exemptions in Nigeria. 
            Here&apos;s what you need to know.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Not Legal or Tax Advice</h3>
              <p className="text-sm text-amber-800">
                This article provides general information based on Nigerian tax laws. Always consult 
                a qualified tax professional or accountant for advice specific to your business.
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>The ₦25 Million Threshold</h2>
          <p>
            Under Nigerian tax law, small businesses with annual gross revenue under ₦25 million 
            may qualify for preferential tax treatment or exemptions.
          </p>

          <div className="not-prose my-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm text-emerald-900 font-medium mb-1">
                  What This Means for You
                </p>
                <p className="text-sm text-emerald-800">
                  If your business makes less than ₦25 million per year (~₦2 million per month), 
                  you likely pay less tax or may be exempt from certain taxes.
                </p>
              </div>
            </div>
          </div>

          <h2>Types of Tax Exemptions</h2>

          <h3>1. Value Added Tax (VAT)</h3>
          <p>
            Small businesses below the ₦25 million threshold are typically <strong>exempt from 
            collecting and remitting VAT</strong>.
          </p>
          <ul>
            <li><strong>Standard VAT rate:</strong> 7.5% on goods and services</li>
            <li><strong>Below ₦25M:</strong> You don&apos;t charge VAT on your invoices</li>
            <li><strong>Above ₦25M:</strong> You must register for VAT and charge customers</li>
          </ul>

          <h3>2. Company Income Tax (CIT)</h3>
          <p>
            Small companies may qualify for reduced tax rates:
          </p>
          <ul>
            <li><strong>First ₦25 million:</strong> 0% (tax exempt)</li>
            <li><strong>Next ₦25 million (₦25M - ₦50M):</strong> 20%</li>
            <li><strong>Above ₦50 million:</strong> 30% (standard rate)</li>
          </ul>

          <div className="not-prose my-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Example Calculation
                </p>
                <p className="text-sm text-blue-800">
                  If your company makes ₦20 million in profit annually:
                  <br />
                  <strong>Tax = ₦0</strong> (fully exempt)
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  If your company makes ₦40 million in profit:
                  <br />
                  First ₦25M = ₦0 (exempt)
                  <br />
                  Next ₦15M = ₦3M (20% of ₦15M)
                  <br />
                  <strong>Total Tax = ₦3 million</strong>
                </p>
              </div>
            </div>
          </div>

          <h3>3. Personal Income Tax</h3>
          <p>
            If you&apos;re a freelancer or sole proprietor (not a registered company), you pay 
            personal income tax instead of CIT. Nigeria uses progressive tax bands:
          </p>
          <ul>
            <li>First ₦300,000: 7%</li>
            <li>Next ₦300,000: 11%</li>
            <li>Next ₦500,000: 15%</li>
            <li>Above ₦1.6 million: 24%</li>
          </ul>

          <h2>How Suoops Helps</h2>
          <p>
            Suoops helps you track your revenue so you know where you stand:
          </p>
          <ul>
            <li><strong>Dashboard overview:</strong> See your total revenue month by month</li>
            <li><strong>Analytics:</strong> View your revenue trends and totals</li>
            <li><strong>Invoice history:</strong> All your invoices in one place for easy tracking</li>
            <li><strong>Export reports:</strong> Download your invoice data for tax filing</li>
          </ul>

          <h2>What Happens When You Cross ₦25M?</h2>
          <p>
            If your business grows past ₦25 million in annual revenue:
          </p>
          <ol>
            <li><strong>Register for VAT:</strong> Apply for a Tax Identification Number (TIN) if you don&apos;t have one</li>
            <li><strong>Start charging VAT:</strong> Add 7.5% to your invoices</li>
            <li><strong>File monthly returns:</strong> Submit VAT returns to FIRS</li>
            <li><strong>Pay higher CIT:</strong> Income above ₦25M is taxed at 20%</li>
          </ol>

          <div className="not-prose my-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-sm text-slate-900 font-medium mb-2">
              📊 Track your revenue in Suoops
            </p>
            <p className="text-sm text-slate-600">
              Use the Analytics page to monitor your year-to-date revenue and plan ahead 
              for tax compliance.
            </p>
          </div>

          <h2>Common Questions</h2>

          <h3>Do I need to register my business?</h3>
          <p>
            Technically, you can operate as a sole proprietor without formal registration. However, 
            registering as a business (with CAC) gives you:
          </p>
          <ul>
            <li>Legal protection for your personal assets</li>
            <li>Access to business bank accounts</li>
            <li>Easier tax filing</li>
            <li>More credibility with customers</li>
          </ul>

          <h3>Is the ₦25M based on revenue or profit?</h3>
          <p>
            <strong>Gross revenue</strong> (total money earned), not profit. Even if your expenses 
            are high and profit is low, the threshold is based on how much you invoiced customers.
          </p>

          <h3>What if I only work part-time or seasonally?</h3>
          <p>
            The ₦25 million threshold is <strong>annual</strong>. If you make ₦5 million in 
            3 months then stop, your annual revenue is still ₦5M (below the threshold).
          </p>

          <h3>Do I need to file tax returns even if exempt?</h3>
          <p>
            Yes! Even if you owe ₦0 in tax, you should still file returns. This keeps you compliant 
            and creates a clean record for future growth.
          </p>

          <h3>Can I claim business expenses to reduce taxable income?</h3>
          <p>
            Absolutely. Legitimate business expenses (rent, equipment, marketing, etc.) reduce your 
            taxable profit. Keep receipts for everything!
          </p>

          <h2>How to Check Your Revenue in Suoops</h2>
          <ol>
            <li>Go to your <strong>Dashboard</strong></li>
            <li>Look at the <strong>&quot;Total Revenue&quot;</strong> card</li>
            <li>Use the date filter to see:
              <ul>
                <li>This month</li>
                <li>This year (year-to-date)</li>
                <li>Last 12 months</li>
              </ul>
            </li>
            <li>Click <strong>&quot;View Reports&quot;</strong> for detailed breakdowns</li>
          </ol>

          <h2>Staying Tax Compliant</h2>
          <p>
            Here&apos;s what you should do to stay compliant:
          </p>

          <h3>✅ Keep Good Records</h3>
          <ul>
            <li>Use Suoops to invoice all your work (creates automatic paper trail)</li>
            <li>Mark invoices as paid when you receive money</li>
            <li>Keep receipts for business expenses</li>
          </ul>

          <h3>✅ Track Your Annual Revenue</h3>
          <ul>
            <li>Check your Suoops dashboard monthly</li>
            <li>Watch for the ₦25M threshold notification</li>
            <li>Plan ahead if you&apos;re approaching the limit</li>
          </ul>

          <h3>✅ File Returns on Time</h3>
          <ul>
            <li>Personal income tax: File by March 31 each year</li>
            <li>Company income tax: File within 6 months of year-end</li>
            <li>VAT (if applicable): File monthly by the 21st</li>
          </ul>

          <h3>✅ Get Professional Help When Needed</h3>
          <p>
            As your business grows, consider hiring:
          </p>
          <ul>
            <li>A bookkeeper to manage your finances</li>
            <li>An accountant for tax planning and filing</li>
            <li>A tax consultant when crossing major thresholds</li>
          </ul>

          <h2>Resources</h2>
          <ul>
            <li>
              <strong>FIRS (Federal Inland Revenue Service):</strong>{" "}
              <a href="https://www.firs.gov.ng" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                www.firs.gov.ng
              </a>
            </li>
            <li>
              <strong>Apply for TIN:</strong>{" "}
              <a href="https://taxid.firs.gov.ng" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                taxid.firs.gov.ng
              </a>
            </li>
            <li>
              <strong>CAC (Corporate Affairs Commission):</strong>{" "}
              <a href="https://www.cac.gov.ng" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                www.cac.gov.ng
              </a>
            </li>
          </ul>

          <h2>Final Thoughts</h2>
          <p>
            Tax exemptions for small businesses exist to help you grow without the burden of complex 
            compliance. Focus on serving your customers and building your business — Suoops will help 
            you track the numbers.
          </p>
          <p>
            When you do cross ₦25 million (and you will!), celebrate it. It means your business is 
            growing. We&apos;ll be there to help you navigate the next phase.
          </p>
        </article>

        {/* Next Steps */}
        <div className="mt-12 rounded-xl bg-slate-50 border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="space-y-3">
            <Link 
              href="/articles/getting-started/first-invoice"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Create your first invoice
            </Link>
            <Link 
              href="/articles/invoicing/track-payments"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Track payments to monitor your revenue
            </Link>
            <Link 
              href="/contact"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Contact support for help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
