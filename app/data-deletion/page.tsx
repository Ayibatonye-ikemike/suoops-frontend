import Link from "next/link";

export default function DataDeletionPage() {
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
        <h1 className="text-4xl font-bold text-slate-900">Data Deletion Instructions</h1>
        <p className="mt-4 text-lg text-slate-600">
          Last updated: December 16, 2025
        </p>

        <div className="mt-12 space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">Your Right to Delete Your Data</h2>
            <p className="mt-4">
              At SuoOps, we respect your privacy and your right to control your personal data. 
              You can request deletion of your account and all associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">How to Request Data Deletion</h2>
            <p className="mt-4">You can delete your data in the following ways:</p>
            
            <div className="mt-6 space-y-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Option 1: Self-Service Deletion</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-6">
                  <li>Log in to your SuoOps account at <a href="https://suoops.com/login" className="text-blue-600 hover:underline">suoops.com/login</a></li>
                  <li>Go to <strong>Settings</strong></li>
                  <li>Scroll to <strong>Account Management</strong></li>
                  <li>Click <strong>&quot;Delete My Account&quot;</strong></li>
                  <li>Confirm your decision</li>
                </ol>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Option 2: Email Request</h3>
                <p className="mt-3">
                  Send an email to <a href="mailto:support@suoops.com" className="text-blue-600 hover:underline">support@suoops.com</a> with:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Subject line: &quot;Data Deletion Request&quot;</li>
                  <li>Your registered email address</li>
                  <li>Your phone number (for verification)</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  We will process your request within 7 business days.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Option 3: WhatsApp Request</h3>
                <p className="mt-3">
                  Send a message to our WhatsApp number with the text: <strong>&quot;Delete my account&quot;</strong>
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  You must send this from the phone number registered with your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">What Data Will Be Deleted</h2>
            <p className="mt-4">When you request data deletion, we will permanently remove:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Account Information:</strong> Your name, email, phone number, and business details</li>
              <li><strong>Invoices:</strong> All invoices you have created</li>
              <li><strong>Customer Data:</strong> Customer information associated with your invoices</li>
              <li><strong>Payment Records:</strong> Bank details and payment history</li>
              <li><strong>Uploaded Files:</strong> Any logos, receipts, or documents you&apos;ve uploaded</li>
              <li><strong>WhatsApp Messages:</strong> Conversation history with our bot</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">Data Retention for Legal Purposes</h2>
            <p className="mt-4">
              Some data may be retained for a limited period as required by law:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Transaction Records:</strong> May be retained for up to 7 years for tax and legal compliance</li>
              <li><strong>Anonymized Analytics:</strong> Aggregated, non-identifiable usage data may be retained</li>
            </ul>
            <p className="mt-4">
              This retained data will be automatically deleted after the legal retention period expires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">Third-Party Data</h2>
            <p className="mt-4">
              If you signed in using Google or Facebook, you should also revoke our app&apos;s access:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><strong>Google:</strong> <a href="https://myaccount.google.com/permissions" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Manage Google Third-Party Access</a></li>
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=applications" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Manage Facebook Apps</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">Confirmation</h2>
            <p className="mt-4">
              Once your data has been deleted, we will send you a confirmation email to the address 
              associated with your account (before deletion).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            <p className="mt-4">
              If you have any questions about data deletion, please contact us:
            </p>
            <ul className="mt-4 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:support@suoops.com" className="text-blue-600 hover:underline">support@suoops.com</a></li>
              <li><strong>WhatsApp:</strong> Message our business number</li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-900">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
