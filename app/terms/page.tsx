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
          Last updated: November 9, 2025
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
              SuoOps is a WhatsApp and Email-based invoice management platform that allows businesses to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Create invoices via text messages or receipt photos on WhatsApp</li>
              <li>Send invoices to customers via WhatsApp and Email</li>
              <li>Generate professional PDF invoices with custom branding (logos)</li>
              <li>Track invoice status and payments with QR code verification</li>
              <li>Receive automated tax compliance reports (VAT and development levy calculations)</li>
              <li>Manage customer information and payment details</li>
              <li>Sign in securely using Google OAuth (optional)</li>
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
            <h2 className="text-2xl font-bold text-slate-900">4. Subscription Plans</h2>
            <p className="mt-4">We offer the following subscription tiers:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Free Plan:</strong> ₦0 - 5 free invoices to start</li>
              <li><strong>Starter Plan:</strong> No monthly fee - Buy invoice packs (₦2,500 per 100) + Tax reports & automation</li>
              <li><strong>Pro Plan:</strong> ₦5,000/month - 100 invoices included + Custom logo branding + Priority support</li>
              <li><strong>Business Plan:</strong> ₦10,000/month - 100 invoices included + Photo OCR (15/mo) + API access</li>
            </ul>
            <p className="mt-4">
              <strong>Invoice Packs:</strong> All plans can purchase additional invoice packs at ₦2,500 per 100 invoices. Starter plan users buy packs as needed with no monthly subscription fee.
            </p>
            <p className="mt-4">
              <strong>Business Plan OCR Quota:</strong> The Business plan includes up to 15 photo OCR invoices per 30-day billing cycle. This quota resets every 30 days from your subscription start date.
            </p>
          </section>          <section>
            <h2 className="text-2xl font-bold text-slate-900">5. Payment Terms</h2>
            <p className="mt-4">
              Subscription payments are processed securely through Paystack. By subscribing, you authorize us to charge your payment method on a recurring basis. We do not store your card details.
            </p>
            <p className="mt-4">
              <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee for first-time subscribers. After 7 days, subscription fees are non-refundable. You may cancel at any time to prevent future charges.
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
            <h2 className="text-2xl font-bold text-slate-900">7. Invoice Payments</h2>
            <p className="mt-4">
              <strong>Important:</strong> SuoOps is NOT a payment processor. We facilitate invoice delivery via WhatsApp, but:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Customers pay directly to your bank account</li>
              <li>We do NOT hold, process, or guarantee payments</li>
              <li>You are responsible for verifying and confirming payments</li>
              <li>Disputes between you and your customers are your responsibility</li>
            </ul>
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
            <h2 className="text-2xl font-bold text-slate-900">8.1. Premium Features (Business+ Plans)</h2>
            <p className="mt-4">
              The following premium features are available exclusively on Business and Enterprise plans:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Photo OCR:</strong> Snap receipt photos and AI automatically extracts invoice details</li>
            </ul>
            <p className="mt-4">
              <strong>Custom Branding</strong> (logo upload) is available on Pro, Business, and Enterprise plans.
            </p>
            <p className="mt-4">
              <strong>Important:</strong> Receipt photos are processed using AI and immediately deleted after extraction. We do not store these files permanently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">8.2. Tax Compliance Automation</h2>
            <p className="mt-4">
              Starter, Pro, Business, and Enterprise plans receive automated monthly tax compliance reports that include:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>VAT (Value Added Tax) calculations on taxable sales</li>
              <li>Development Levy calculations (4% for non-small businesses)</li>
              <li>Taxable, zero-rated, and exempt sales breakdowns</li>
              <li>Assessable profit calculations based on paid invoices</li>
            </ul>
            <p className="mt-4">
              Free plan users do NOT receive automated tax reports. Upgrade to Starter or higher to unlock this feature.
            </p>
            <p className="mt-4">
              <strong>Disclaimer:</strong> Tax reports are generated automatically based on your invoice data and Nigerian tax laws as of the last update. These are for informational purposes and should be reviewed by a tax professional. We are not responsible for tax filing accuracy or compliance with FIRS (Federal Inland Revenue Service) regulations. You are solely responsible for filing taxes and verifying calculations.
            </p>
          </section>          <section>
            <h2 className="text-2xl font-bold text-slate-900">8.2. Tax Compliance Automation</h2>
            <p className="mt-4">
              All users (including Free plan) receive automated monthly tax compliance reports that include:
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
              <li>Non-payment of subscription fees</li>
              <li>Extended inactivity (free accounts only)</li>
            </ul>
            <p className="mt-4">
              You may cancel your subscription at any time from your dashboard. Upon termination, you will lose access to your data after 30 days unless you export it.
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
              By using SuoOps, you agree to: (1) Use the Service responsibly and legally, (2) Pay subscription fees on time, (3) Verify customer payments yourself, (4) Not hold us liable for payment disputes or WhatsApp issues, and (5) Accept that we may update these Terms with notice.
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
