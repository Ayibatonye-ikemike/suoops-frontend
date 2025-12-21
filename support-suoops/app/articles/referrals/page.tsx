import Link from "next/link";
import { ChevronRight, Users, FileText } from "lucide-react";

const articles = [
  { 
    slug: "how-referrals-work", 
    title: "How referral rewards work",
    description: "Learn how to earn free months by referring friends to SuoOps."
  },
];

export default function ReferralsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Referrals</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Referrals</h1>
              <p className="text-slate-600">Earn rewards by referring others</p>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/referrals/${article.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <FileText className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-slate-600">{article.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 ml-auto flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Referral CTA */}
        <div className="mt-10 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-6 text-center">
          <h3 className="font-bold text-slate-900 mb-2">Start earning rewards!</h3>
          <p className="text-slate-600 mb-4">Find your referral code in the SuoOps dashboard.</p>
          <a
            href="https://suoops.com/dashboard/referrals"
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            View My Referral Code
          </a>
        </div>
      </div>
    </div>
  );
}
