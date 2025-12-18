import Link from "next/link";
import { ChevronRight, MessageCircle, Clock, Smartphone, CheckCircle, Bell } from "lucide-react";

export default function WhatsAppSetupArticle() {
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
          <span className="text-slate-900">Setup Guide</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <MessageCircle className="h-3 w-3" />
              WhatsApp Integration
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              3 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Setting Up WhatsApp Notifications
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Receive instant invoice notifications and business alerts directly on WhatsApp.
          </p>
        </div>

        {/* Feature Highlight */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6">
          <h3 className="font-semibold text-green-900 mb-3">📱 WhatsApp Notifications Include:</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Invoice payment confirmations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>New invoice reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Payment due alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Referral reward notifications</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>Prerequisites</h2>
          <p>
            Before setting up WhatsApp notifications, make sure you have:
          </p>
          <ul>
            <li>An active SuoOps account</li>
            <li>WhatsApp installed on your phone</li>
            <li>A valid phone number linked to WhatsApp</li>
          </ul>

          <h2>How to Enable WhatsApp Notifications</h2>
          
          <h3>Step 1: Go to Settings</h3>
          <p>
            Log in to SuoOps and navigate to <strong>Settings</strong> → <strong>Notifications</strong>.
          </p>

          <h3>Step 2: Verify Your Phone Number</h3>
          <p>
            Make sure your phone number is entered correctly in your profile. 
            This should be the number linked to your WhatsApp account.
          </p>
          <div className="not-prose my-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Include your country code. For Nigeria, use format: 
              <code className="ml-1 bg-amber-100 px-1 rounded">234XXXXXXXXXX</code>
            </p>
          </div>

          <h3>Step 3: Enable WhatsApp Toggle</h3>
          <p>
            In the Notifications settings, find the <strong>&quot;WhatsApp Notifications&quot;</strong> section 
            and toggle it <strong>ON</strong>.
          </p>

          <h3>Step 4: Opt-In Confirmation</h3>
          <p>
            You&apos;ll receive a WhatsApp message from SuoOps asking you to confirm your subscription. 
            Reply with <strong>&quot;YES&quot;</strong> to complete the setup.
          </p>

          <h3>Step 5: Done!</h3>
          <p>
            You&apos;ll now receive important business notifications directly on WhatsApp.
          </p>

          <h2>Types of Notifications</h2>
          
          <h3><Bell className="inline h-5 w-5 text-emerald-600" /> Payment Notifications</h3>
          <ul>
            <li>When a customer views your invoice</li>
            <li>When a payment is made</li>
            <li>When a payment fails</li>
          </ul>

          <h3><Bell className="inline h-5 w-5 text-emerald-600" /> Invoice Reminders</h3>
          <ul>
            <li>Payment due date approaching</li>
            <li>Overdue invoice alerts</li>
          </ul>

          <h3><Bell className="inline h-5 w-5 text-emerald-600" /> Business Alerts</h3>
          <ul>
            <li>New referral sign-ups</li>
            <li>Referral reward earned</li>
            <li>Subscription status updates</li>
          </ul>

          <h2>Managing Notification Preferences</h2>
          <p>
            You can customize which notifications you receive:
          </p>
          <ol>
            <li>Go to <strong>Settings</strong> → <strong>Notifications</strong></li>
            <li>Under WhatsApp section, toggle individual notification types</li>
            <li>Turn off notifications you don&apos;t want</li>
            <li>Changes take effect immediately</li>
          </ol>

          <h2>Disabling WhatsApp Notifications</h2>
          <p>
            To stop receiving WhatsApp messages:
          </p>
          <ol>
            <li>Reply <strong>&quot;STOP&quot;</strong> to any SuoOps WhatsApp message, OR</li>
            <li>Go to Settings → Notifications and toggle WhatsApp OFF</li>
          </ol>

          <h2>Troubleshooting</h2>
          
          <h3>Not receiving messages?</h3>
          <ul>
            <li>Check that your phone number includes the country code</li>
            <li>Ensure WhatsApp is active on your phone</li>
            <li>Check if you&apos;ve blocked the SuoOps number</li>
            <li>Try disabling and re-enabling notifications</li>
          </ul>

          <h3>Receiving too many messages?</h3>
          <p>
            Customize your preferences in Settings → Notifications to only receive 
            the most important alerts.
          </p>

          <h3>Changed phone number?</h3>
          <p>
            Update your phone number in Settings → Profile, then re-enable WhatsApp 
            notifications to link the new number.
          </p>

          <h2>Data Privacy</h2>
          <p>
            Your privacy is important to us:
          </p>
          <ul>
            <li>We only send business-related notifications</li>
            <li>Your number is never shared with third parties</li>
            <li>You can opt out at any time</li>
            <li>Messages are sent via secure channels</li>
          </ul>
        </article>

        {/* Related Articles */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="space-y-3">
            <Link href="/articles/whatsapp/send-invoices" className="block text-sm text-emerald-600 hover:underline">
              → Sending invoices via WhatsApp
            </Link>
            <Link href="/articles/account/profile-settings" className="block text-sm text-emerald-600 hover:underline">
              → Updating your profile
            </Link>
            <Link href="/articles/invoicing/track-payments" className="block text-sm text-emerald-600 hover:underline">
              → Tracking invoice payments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
