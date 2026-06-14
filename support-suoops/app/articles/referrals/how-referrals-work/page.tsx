import Link from "next/link";
import { ChevronRight, Gift, Clock, Copy, CheckCircle, Wallet, FileText } from "lucide-react";

export default function HowReferralsWorkArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles/referrals" className="hover:text-emerald-600">Referrals</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">How Referrals Work</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              <Gift className="h-3 w-3" />
              Referral Program
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              4 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            How the Referral Program Works
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Earn ₦488 for every friend who subscribes to Pro!
          </p>
        </div>

        {/* Highlight Box */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 p-6">
          <h3 className="font-semibold text-purple-900 mb-2">💰 ₦488 Cash Commission on Every Pro Referral</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              <span><strong>Pro subscriber referral:</strong> You earn ₦488 cash per referral</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span><strong>Monthly payout:</strong> Cash paid at the end of each month</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <span><strong>No limit:</strong> The more you refer, the more you earn!</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>Overview</h2>
          <p>
            Our referral program rewards you with a <strong>15% cash commission</strong> for every friend who subscribes 
            to the Pro plan. When someone signs up using your unique referral code and becomes a Pro subscriber, 
            you earn ₦488 cash paid out at the end of each month.
          </p>

          <h2>How It Works</h2>
          
          <div className="not-prose my-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Get Your Code</h4>
                  <p className="text-sm text-slate-600">
                    Find your unique referral code in Dashboard → Referrals. Copy it to share.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Share With Friends</h4>
                  <p className="text-sm text-slate-600">
                    Share your code via WhatsApp, email, or social media with business owners.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">They Subscribe to Pro</h4>
                  <p className="text-sm text-slate-600">
                    Your friend signs up with your code and buys a Pro Pack (₦2,000).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Earn ₦488 Cash!</h4>
                  <p className="text-sm text-slate-600">
                    You instantly earn a ₦488 commission, paid out in cash at the end of the month!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2>Finding Your Referral Code</h2>
          <ol>
            <li>Log in to your SuoOps account</li>
            <li>Go to <strong>Dashboard</strong></li>
            <li>Click on <strong>Referrals</strong> in the sidebar</li>
            <li>Your unique code will be displayed at the top of the page</li>
            <li>Click the <Copy className="inline h-4 w-4" /> copy button to copy it to your clipboard</li>
          </ol>

          <h2>Using a Referral Code</h2>
          <p>
            If someone shared a referral code with you, here&apos;s how to use it:
          </p>
          <ol>
            <li>Go to the SuoOps sign-up page</li>
            <li>Fill in your business details</li>
            <li>In the <strong>&quot;Referral Code&quot;</strong> field, enter the code you received</li>
            <li>Complete your registration</li>
            <li>You&apos;ll get a free account to start using SuoOps!</li>
          </ol>

          <h2>Referral Rewards Explained</h2>
          
          <h3>What You Earn</h3>
          <ul>
            <li><strong>₦488 cash commission</strong> for each Pro subscriber you refer</li>
            <li>Commissions are <strong>paid out in cash</strong> at the end of each month</li>
            <li>Rewards stack - the more Pro subscribers you refer, the more you earn!</li>
            <li>No limit on how many people you can refer</li>
          </ul>

          <h3>What Counts as a Paid Referral?</h3>
          <p>
            Only Pro Pack purchases (₦2,000) earn you commission:
          </p>
          <ul>
            <li><CheckCircle className="inline h-4 w-4 text-emerald-600" /> <strong>Pro Pack buyer:</strong> You earn ₦488 cash commission</li>
            <li className="text-slate-500"><strong>Free/Starter signups:</strong> No commission (focus on quality referrals)</li>
          </ul>

          <h2>Tracking Your Referrals</h2>
          <p>
            The Referrals dashboard shows:
          </p>
          <ul>
            <li><strong>Pro Referrals</strong> - How many Pro subscribers used your code</li>
            <li><strong>Total Earned</strong> - Your total commission earned (₦488 × Pro referrals)</li>
            <li><strong>Pending</strong> - Signups waiting for Pro subscription</li>
            <li><strong>Ready to Claim</strong> - Commissions ready to add to your balance</li>
          </ul>

          <h2>Tips for Successful Referrals</h2>
          <div className="not-prose my-6 rounded-xl bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-900 mb-4">💡 Pro Tips</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Share with business owners who invoice customers regularly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Explain how SuoOps saved you time with professional invoicing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Share your code in business WhatsApp groups (with permission)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Mention the free trial so friends can try before subscribing
              </li>
            </ul>
          </div>

          <h2>Frequently Asked Questions</h2>
          
          <h3>When do I receive my commission?</h3>
          <p>
            Your commission is earned instantly when your referred friend subscribes to Pro. 
            All commissions are paid out in cash at the end of each month to your bank account.
          </p>

          <h3>How much do I earn per referral?</h3>
          <p>
            You earn ₦488 cash for each Pro subscriber you refer. 
            There&apos;s no limit - refer 10 Pro subscribers and earn ₦4,880 cash!
          </p>

          <h3>Can I use my own referral code?</h3>
          <p>
            No, referral codes cannot be used by the account that generated them.
          </p>

          <h3>Do rewards expire?</h3>
          <p>
            Commissions must be claimed within 90 days. Once claimed, they&apos;re queued for payout at month end.
          </p>

          <h3>What if my friend forgets to enter the code?</h3>
          <p>
            Unfortunately, referral codes must be entered during registration. 
            <Link href="/contact">Contact support</Link> if there&apos;s an issue.
          </p>

          <h3>How do I receive my cash payout?</h3>
          <p>
            At the end of each month, we&apos;ll transfer your earned commissions to your registered bank account. 
            Make sure your banking details are up to date in your profile settings.
          </p>
        </article>

        {/* Related Articles */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="space-y-3">
            <Link href="/articles/referrals/share-code" className="block text-sm text-emerald-600 hover:underline">
              → How to share your referral code
            </Link>
            <Link href="/articles/billing/subscription-plans" className="block text-sm text-emerald-600 hover:underline">
              → Understanding subscription plans
            </Link>
            <Link href="/articles/getting-started/dashboard-overview" className="block text-sm text-emerald-600 hover:underline">
              → Dashboard overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
