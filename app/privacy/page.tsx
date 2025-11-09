import Link from "next/link";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-lg text-slate-600">
          Last updated: November 9, 2025
        </p>
        <div className="mt-12 space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
            <p className="mt-4">
              Welcome to SuoOps (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoice management service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
            <p className="mt-4">We collect the following types of information:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Account Information:</strong> Name, email address, phone number, and business details when you register</li>
              <li><strong>Google Account Data:</strong> When you sign in with Google, we receive your name, email, and profile picture (you can revoke access anytime)</li>
              <li><strong>Invoice Data:</strong> Customer names, phone numbers, email addresses, amounts, and invoice details you create</li>
              <li><strong>Payment Information:</strong> Bank account details for receiving payments (we do NOT store card details)</li>
              <li><strong>WhatsApp Messages:</strong> Messages sent to our WhatsApp bot for invoice creation</li>
              <li><strong>Voice Recordings:</strong> Voice notes sent via WhatsApp (transcribed using AI and immediately deleted after processing)</li>
              <li><strong>Receipt Images:</strong> Photos of receipts sent for OCR processing (processed by AI to extract invoice details, then deleted)</li>
              <li><strong>Custom Branding:</strong> Business logos uploaded for invoice customization (stored securely on AWS S3)</li>
              <li><strong>Tax Data:</strong> VAT rates, development levy calculations, and tax compliance reports generated from your invoices</li>
              <li><strong>Usage Data:</strong> Information about how you use our service, including access times and features used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
            <p className="mt-4">We use your information to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Provide and maintain our invoice management service</li>
              <li>Process and send invoices to your customers via WhatsApp and Email</li>
              <li>Generate PDF invoices and receipts with your custom branding</li>
              <li>Process voice notes and receipt photos using AI to extract invoice details</li>
              <li>Calculate and generate automated tax compliance reports (VAT, development levy)</li>
              <li>Send you notifications about invoice status, payments, and tax deadlines</li>
              <li>Process subscription payments and manage your account</li>
              <li>Authenticate your account using Google OAuth (if you choose this option)</li>
              <li>Improve our service and develop new features</li>
              <li>Comply with legal obligations and tax regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">4. Data Storage and Security</h2>
            <p className="mt-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Data encrypted in transit using TLS/SSL</li>
              <li>Secure cloud storage on AWS (S3 for files and logos, RDS for database)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication for all systems</li>
              <li>Voice recordings are transcribed using AI and immediately deleted (not stored)</li>
              <li>Receipt photos are processed for OCR and deleted (not permanently stored)</li>
              <li>Custom logos stored securely with access controls</li>
              <li>Tax reports encrypted and accessible only to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">5. Third-Party Services</h2>
            <p className="mt-4">We use the following third-party services:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Google OAuth:</strong> For secure single sign-on authentication (optional)</li>
              <li><strong>WhatsApp Cloud API (Meta):</strong> For sending and receiving messages</li>
              <li><strong>Brevo (formerly Sendinblue):</strong> For sending email notifications and invoice delivery</li>
              <li><strong>Paystack:</strong> For processing subscription payments</li>
              <li><strong>AWS:</strong> For cloud infrastructure and storage (S3 for files, RDS for database)</li>
              <li><strong>OpenAI Whisper:</strong> For AI-powered voice note transcription</li>
              <li><strong>OCR AI Services:</strong> For extracting invoice details from receipt photos</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">6. Data Sharing</h2>
            <p className="mt-4">
              We do NOT sell your personal information. We only share your data:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>With your customers when you send them invoices</li>
              <li>With service providers who help us operate our service</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">7. Your Rights</h2>
            <p className="mt-4">You have the right to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Access and download your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Object to data processing</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{" "}
              <a href="mailto:info@suoops.com" className="text-blue-600 hover:underline">
                info@suoops.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">8. Data Retention</h2>
            <p className="mt-4">
              We retain your data for as long as your account is active or as needed to provide services. When you delete your account, we will delete or anonymize your data within 30 days, except where we must retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">9. Children&apos;s Privacy</h2>
            <p className="mt-4">
              Our service is not intended for children under 18. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">10. International Data Transfers</h2>
            <p className="mt-4">
              Your data may be transferred to and processed in countries other than Nigeria, including the United States and European Union, where our service providers are located. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">11. Changes to This Policy</h2>
            <p className="mt-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our service. Your continued use of SuoOps after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">12. Contact Us</h2>
            <p className="mt-4">
              If you have questions about this Privacy Policy or our data practices, contact us:
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
