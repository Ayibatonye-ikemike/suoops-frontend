import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white shadow-lg">
                S
              </div>
              <span className="text-xl font-bold text-slate-900">SuoOps</span>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-4 text-lg text-slate-600">
          Last updated: July 14, 2026
        </p>

        <div className="mt-12 space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">1. Agreement to Terms</h2>
            <p className="mt-4">
              By accessing or using SuoOps (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these Terms, you may not use our Service. These Terms apply to all visitors, users, and others who access the Service.
            </p>
            <p className="mt-4">
              We reserve the right to update these Terms at any time. We will notify you of significant changes via email or through the Service. Your continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">2. Description of Service</h2>
            <p className="mt-4">
              SuoOps is a commerce operating system for businesses. It allows businesses to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Create and send invoices and receipts from the web dashboard, WhatsApp or email, with custom branding, PDF and QR verification</li>
              <li>Run a buyer-protected online storefront where customers browse, order and pay online</li>
              <li>Accept online payments and settle proceeds to your bank</li>
              <li>Arrange courier delivery for storefront orders (buyer-paid at checkout)</li>
              <li>Manage inventory, expenses, customers and team members</li>
              <li>Receive automated tax compliance reports (VAT and development levy calculations)</li>
              <li>Sign in securely using phone or email one-time codes (OTP), and optionally Google</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">3. Account Registration</h2>
            <p className="mt-4">To use SuoOps, you must:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">4. Pricing &amp; Fees</h2>
            <p className="mt-4">
              SuoOps is free to use — there are no subscription plans. We charge a
              commission per invoice, with fees as low as 1%:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Manual invoices — 1%</strong> (minimum ₦100), <strong>capped at ₦500 for invoices up to ₦500,000</strong>, then +₦500 for every additional ₦500,000. This fee is charged from your prepaid wallet when the invoice is created.</li>
              <li><strong>Storefront orders — 3%</strong> (capped at ₦2,000 per ₦500,000), charged only when the customer pays online.</li>
              <li><strong>Wallet top-ups:</strong> you fund your prepaid wallet (e.g. ₦1,250 / ₦5,000 / ₦20,000) to cover invoice fees. Top-ups are not a subscription and do not auto-renew.</li>
            </ul>
            <p className="mt-4">
              The exact fee for each invoice is shown in-app before you confirm, and our
              fees may change with notice.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900">5. Payment Terms</h2>
            <p className="mt-4">
              Wallet top-ups and online payments are processed securely through our
              payment partners (e.g. Paystack, Flutterwave). We do not store your card
              details.
            </p>
            <p className="mt-4">
              <strong>Refunds:</strong> wallet balances are consumed as per-invoice fees
              and are generally non-refundable once used; an unused balance may be
              refunded at our discretion. Refunds to storefront <em>buyers</em> are
              governed by Section 7.1 (Storefront Orders &amp; Buyer Protection).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">6. Acceptable Use</h2>
            <p className="mt-4">You agree NOT to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Use the Service for any illegal or fraudulent purpose</li>
              <li>Send spam or unsolicited messages to customers</li>
              <li>Create fake or fraudulent invoices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to access unauthorized areas or data</li>
              <li>Use the Service to harass, abuse, or harm others</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">7. Direct Invoice Payments</h2>
            <p className="mt-4">
              <strong>Important:</strong> For direct invoices you send over WhatsApp or email (where the customer pays your bank account or your own online payment link), SuoOps only facilitates delivery:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Customers pay directly to your bank account</li>
              <li>We do NOT hold, process, or guarantee these payments</li>
              <li>You are responsible for verifying and confirming payments</li>
              <li>Disputes on these direct payments are between you and your customer</li>
            </ul>
            <p className="mt-4 text-sm text-slate-500">
              Storefront orders work differently — see Section 7.1 (Storefront Orders &amp; Buyer Protection).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">7.1. Storefront Orders &amp; Buyer Protection (Escrow)</h2>
            <p className="mt-4">
              When a customer orders and pays through your public SuoOps storefront, the payment may be
              <strong> held in escrow</strong> to protect the buyer. By enabling your storefront and accepting online orders, you agree to the following:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Funds are held, not instantly settled.</strong> For businesses that are new or not yet trusted, the customer&apos;s payment is collected and held by SuoOps (via our payment partner) instead of settling to you immediately.
              </li>
              <li>
                <strong>Release window.</strong> Held funds are released to you after the buyer confirms they received their order, OR automatically after the protection window passes with no complaint — 12 hours when you and the customer are in the same state, otherwise 3 days.
              </li>
              <li>
                <strong>Platform fee.</strong> SuoOps deducts a commission (currently 3%) from each released storefront payout. The exact fee is shown in-app and may change with notice.
              </li>
              <li>
                <strong>Accurate listings are required.</strong> Every storefront item must have a clear description and a real photo of the actual item. This is how we know what was ordered if there is a dispute. Items without both are hidden from your store and cannot be ordered.
              </li>
              <li>
                <strong>Delivery is your responsibility.</strong> You must deliver the exact item ordered to the customer&apos;s provided location within a reasonable time.
              </li>
              <li>
                <strong>Disputes &amp; refunds.</strong> If a buyer reports a problem (e.g. non-delivery or wrong item) during the protection window, the order is paused for review. SuoOps may, at its discretion, refund the buyer from the held funds and withhold your payout.
              </li>
              <li>
                <strong>Suspension.</strong> Businesses that repeatedly fail to deliver, list fake or misleading items, or attract fraud reports may be flagged, have their storefront delisted, and/or have their account suspended.
              </li>
              <li>
                <strong>Trusted businesses.</strong> Established businesses that meet our trust criteria may have orders settle directly (without a hold). SuoOps decides trust status and may change it at any time.
              </li>
            </ul>
            <p className="mt-4">
              Buyer protection applies to storefront orders only. It does not turn SuoOps into a guarantor of your business, and it does not cover direct/WhatsApp invoices described in Section 7.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">8. WhatsApp Integration</h2>
            <p className="mt-4">
              Our Service integrates with WhatsApp via the WhatsApp Cloud API. By using our WhatsApp features, you agree that:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>You must comply with WhatsApp&apos;s Terms of Service and Business Policy</li>
              <li>We are not responsible for WhatsApp service interruptions or delivery failures</li>
              <li>Receipt photos sent for OCR processing are analyzed and deleted (not stored)</li>
              <li>Messages must be sent to our official WhatsApp number only</li>
              <li>We may suspend service if WhatsApp flags your account for spam or violations</li>
            </ul>
            <p className="mt-4">
              <strong>Email Delivery:</strong> Invoices are also sent via email using Brevo SMTP. We are not responsible for email delivery failures due to spam filters, invalid addresses, or recipient email service issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">8.1. Photo OCR &amp; Custom Branding</h2>
            <p className="mt-4">
              These features are included free for all businesses:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Photo OCR:</strong> Snap a receipt photo and AI extracts the invoice details automatically</li>
              <li><strong>Custom Branding:</strong> Upload your logo for branded invoices and receipts</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> Receipt photos are processed using AI and immediately deleted after extraction. We do not store these files permanently.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900">8.2. Tax Compliance Automation</h2>
            <p className="mt-4">
              All businesses receive automated monthly tax compliance reports that include:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>VAT (Value Added Tax) calculations on taxable sales</li>
              <li>Development Levy calculations (4% for non-small businesses)</li>
              <li>Taxable, zero-rated, and exempt sales breakdowns</li>
              <li>Assessable profit calculations based on paid invoices</li>
            </ul>
            <p className="mt-4">
              <strong>Disclaimer:</strong> Tax reports are generated automatically based on your invoice data and Nigerian tax laws as of the last update. These are for informational purposes and should be reviewed by a tax professional. We are not responsible for tax filing accuracy or compliance with FIRS (Federal Inland Revenue Service) regulations. You are solely responsible for filing taxes and verifying calculations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">9. Intellectual Property</h2>
            <p className="mt-4">
              SuoOps and its content (including software, design, text, and logos) are owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer our Service.
            </p>
            <p className="mt-4">
              You retain ownership of your data (invoices, customer information, etc.). By using our Service, you grant us a license to process and display your data as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">10. Service Availability</h2>
            <p className="mt-4">
              We strive to maintain high availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Scheduled maintenance</li>
              <li>Technical issues or emergencies</li>
              <li>Third-party service outages (WhatsApp, AWS, etc.)</li>
              <li>Force majeure events</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">11. Limitation of Liability</h2>
            <p className="mt-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUOOPS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits, revenue, or data</li>
              <li>Customer disputes or payment issues</li>
              <li>WhatsApp delivery failures</li>
              <li>Any damages exceeding the amount you paid in the past 12 months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">12. Indemnification</h2>
            <p className="mt-4">
              You agree to indemnify and hold harmless SuoOps from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">13. Termination</h2>
            <p className="mt-4">
              We may suspend or terminate your account at any time for:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Extended inactivity</li>
            </ul>
            <p className="mt-4">
              You may close your account at any time from your dashboard. Upon termination, you will lose access to your data after 30 days unless you export it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">14. Governing Law</h2>
            <p className="mt-4">
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">15. Changes to Terms</h2>
            <p className="mt-4">
              We may update these Terms from time to time. We will notify you of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">16. Contact Information</h2>
            <p className="mt-4">
              For questions about these Terms, contact us:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@suoops.com" className="text-blue-600 hover:underline">
                  info@suoops.com
                </a>
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a href="https://suoops.com" className="text-blue-600 hover:underline">
                  https://suoops.com
                </a>
              </li>
            </ul>
          </section>

          <section className="rounded-lg bg-blue-50 p-6">
            <h3 className="text-lg font-bold text-slate-900">Quick Summary</h3>
            <p className="mt-2 text-sm">
              By using SuoOps, you agree to: (1) Use the Service responsibly and legally, (2) Keep your wallet funded for invoice fees, (3) Verify customer payments yourself, (4) Not hold us liable for payment disputes or delivery issues, and (5) Accept that we may update these Terms with notice.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
