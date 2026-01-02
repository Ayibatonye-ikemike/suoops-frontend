import Link from "next/link";
import { ChevronRight, Calculator, Clock, AlertCircle, CheckCircle2, Shield, TrendingUp } from "lucide-react";

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
          <span className="text-slate-900">Tax Exemptions (2026 Update)</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              <Calculator className="h-3 w-3" />
              Tax & Compliance
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              Updated for 2026
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              7 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Nigerian Tax Exemptions 2026 (NTA 2025)
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            The Nigeria Tax Act 2025 (NTA 2025) came into effect on January 1, 2026, with significant 
            changes to small business tax thresholds. Here&apos;s what you need to know.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
              <p className="text-sm text-amber-800">
                This article provides general information based on the Nigeria Tax Act 2025 (NTA 2025). 
                Tax laws can change. Always consult a qualified tax professional or accountant for 
                advice specific to your business situation.
              </p>
            </div>
          </div>
        </div>

        {/* Key Changes Summary */}
        <div className="mb-8 rounded-xl bg-blue-50 border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🆕 What Changed in 2026?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Company Income Tax (CIT):</strong> Small business exemption raised from ₦25M to <strong>₦100M</strong></p>
            <p><strong>VAT:</strong> Threshold remains at <strong>₦25M</strong> (unchanged)</p>
            <p><strong>Medium Companies:</strong> New 20% CIT rate for ₦100M - ₦250M turnover</p>
            <p><strong>Personal Income Tax:</strong> New progressive bands with ₦800K tax-free threshold</p>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>Key Tax Thresholds for Small Businesses</h2>
          
          <p>
            Under the Nigeria Tax Act 2025 (NTA 2025), businesses are categorized by annual turnover 
            for tax purposes. The thresholds have been updated significantly.
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tax Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Old Threshold</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">2026 Threshold</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 font-medium">VAT Exemption</td>
                  <td className="px-4 py-3">₦25M</td>
                  <td className="px-4 py-3">₦25M</td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">0% (exempt)</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 font-medium">CIT - Small Company</td>
                  <td className="px-4 py-3">₦25M</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">₦100M</td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">0% (exempt)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">CIT - Medium Company</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">₦100M - ₦250M</td>
                  <td className="px-4 py-3">20%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">CIT - Large Company</td>
                  <td className="px-4 py-3">&gt;₦25M</td>
                  <td className="px-4 py-3">&gt;₦250M</td>
                  <td className="px-4 py-3">30%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="not-prose my-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm text-emerald-900 font-medium mb-1">
                  Great News for Small Businesses!
                </p>
                <p className="text-sm text-emerald-800">
                  If your annual turnover is under ₦100 million, you&apos;re now exempt from Company 
                  Income Tax (CIT). That&apos;s a 4x increase from the previous ₦25M threshold!
                </p>
              </div>
            </div>
          </div>

          <h2>1. Value Added Tax (VAT)</h2>
          <p>
            The VAT exemption threshold remains <strong>unchanged at ₦25 million</strong> annual turnover.
          </p>
          <ul>
            <li><strong>Below ₦25M:</strong> Exempt from VAT collection and remittance</li>
            <li><strong>Above ₦25M:</strong> Must register for VAT and charge 7.5% on invoices</li>
          </ul>
          
          <div className="not-prose my-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-medium mb-1">
                  Important Note
                </p>
                <p className="text-sm text-amber-800">
                  Even if you&apos;re exempt from CIT (under ₦100M), you may still need to register 
                  for VAT if your turnover exceeds ₦25M. These are separate thresholds.
                </p>
              </div>
            </div>
          </div>

          <h2>2. Company Income Tax (CIT)</h2>
          <p>
            The NTA 2025 significantly increased the small business exemption threshold:
          </p>

          <div className="not-prose my-6 space-y-3">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <p className="font-semibold text-emerald-900">Small Companies (≤₦100M turnover)</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">0% CIT</p>
              <p className="text-sm text-emerald-700 mt-1">Completely exempt from Company Income Tax</p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="font-semibold text-blue-900">Medium Companies (₦100M - ₦250M turnover)</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">20% CIT</p>
              <p className="text-sm text-blue-700 mt-1">Reduced rate for medium-sized businesses</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Large Companies (&gt;₦250M turnover)</p>
              <p className="text-2xl font-bold text-slate-700 mt-1">30% CIT</p>
              <p className="text-sm text-slate-700 mt-1">Standard corporate rate</p>
            </div>
          </div>

          <div className="not-prose my-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Example: Medium Company Tax Calculation
                </p>
                <p className="text-sm text-blue-800">
                  Company with ₦150 million annual turnover and ₦30 million profit:
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  CIT = ₦30,000,000 × 20% = <strong>₦6,000,000</strong>
                </p>
              </div>
            </div>
          </div>

          <h2>3. Personal Income Tax (PIT)</h2>
          <p>
            If you&apos;re a freelancer or sole proprietor (not a registered company), you pay 
            Personal Income Tax using the new progressive bands under NTA 2025:
          </p>

          <div className="not-prose my-6 overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Annual Taxable Income</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Tax Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-emerald-50">
                  <td className="px-4 py-3">First ₦800,000</td>
                  <td className="px-4 py-3 text-emerald-700 font-semibold">0% (Tax-free)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">₦800,001 - ₦3,000,000</td>
                  <td className="px-4 py-3">15%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">₦3,000,001 - ₦12,000,000</td>
                  <td className="px-4 py-3">18%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">₦12,000,001 - ₦25,000,000</td>
                  <td className="px-4 py-3">21%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">₦25,000,001 - ₦50,000,000</td>
                  <td className="px-4 py-3">23%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Above ₦50,000,000</td>
                  <td className="px-4 py-3">25%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Key change:</strong> The first ₦800,000 is now completely tax-free, up from 
            the previous Consolidated Relief Allowance system.
          </p>

          <h2>What Still Applies (Even If Exempt)</h2>
          <p>
            Even if your business is exempt from CIT and VAT, you must still:
          </p>
          <ul>
            <li><strong>Register for tax:</strong> Obtain a Tax Identification Number (TIN)</li>
            <li><strong>Keep accurate records:</strong> Maintain proper financial records</li>
            <li><strong>File tax returns:</strong> Submit annual returns (even if you owe ₦0)</li>
            <li><strong>Maintain documentation:</strong> Keep invoices and receipts for 6 years</li>
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

          <h2>Key Thresholds to Watch</h2>
          <ol>
            <li><strong>₦25M:</strong> VAT registration required</li>
            <li><strong>₦100M:</strong> No longer CIT exempt, pay 20% CIT</li>
            <li><strong>₦250M:</strong> Large company rate (30% CIT)</li>
          </ol>

          <h2>Common Questions</h2>

          <h3>What&apos;s the difference between CIT and PIT?</h3>
          <p>
            <strong>Company Income Tax (CIT)</strong> applies to registered companies. 
            <strong>Personal Income Tax (PIT)</strong> applies to individuals, freelancers, 
            and sole proprietors. Most Nigerian small business owners pay PIT.
          </p>

          <h3>Do I need to register my business to benefit?</h3>
          <p>
            You need a TIN (Tax Identification Number) regardless of your business structure. 
            However, you can operate as a sole proprietor without formal CAC registration and 
            still benefit from the tax exemptions.
          </p>

          <h3>Is it based on revenue or profit?</h3>
          <p>
            <strong>Thresholds</strong> (₦25M, ₦100M) are based on <strong>gross turnover/revenue</strong>.
            <strong>Tax calculation</strong> is based on <strong>profit</strong> (revenue minus expenses).
          </p>

          <h3>Do I need to file returns even if exempt?</h3>
          <p>
            Yes! Even if you owe ₦0 in tax, you must file annual returns. This keeps you 
            compliant and creates a clean record for future growth.
          </p>

          <h2>Filing Deadlines</h2>
          <ul>
            <li><strong>Personal Income Tax:</strong> File by March 31 each year</li>
            <li><strong>Company Income Tax:</strong> File within 6 months of financial year-end</li>
            <li><strong>VAT Returns:</strong> File monthly by the 21st of the following month</li>
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
            The Nigeria Tax Act 2025 is great news for small businesses! With the CIT exemption 
            threshold raised to ₦100 million, more businesses can now focus on growth without 
            the burden of corporate income tax.
          </p>
          <p>
            Focus on building your business — Suoops will help you track the numbers. And when 
            you do cross those thresholds, celebrate! It means your business is thriving.
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
