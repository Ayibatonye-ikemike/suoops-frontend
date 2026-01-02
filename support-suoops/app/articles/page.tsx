import Link from "next/link";
import { 
  FileText, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Shield,
  Zap,
  Package,
  Calculator,
  ChevronRight
} from "lucide-react";

const categories = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Learn how to set up your SuoOps account and create your first invoice",
    icon: Zap,
    color: "bg-blue-500",
    articles: [
      { slug: "first-invoice", title: "How to create your first invoice" },
      { slug: "bank-details", title: "Adding bank details for payments" },
    ],
  },
  {
    slug: "invoicing",
    title: "Invoicing",
    description: "Everything about creating, sending, and managing invoices",
    icon: FileText,
    color: "bg-emerald-500",
    articles: [
      { slug: "track-payments", title: "Tracking payment status" },
    ],
  },
  {
    slug: "billing",
    title: "Billing & Subscriptions",
    description: "Manage your subscription, payments, and upgrades",
    icon: CreditCard,
    color: "bg-purple-500",
    articles: [
      { slug: "plans", title: "Understanding subscription plans" },
    ],
  },
  {
    slug: "referrals",
    title: "Referrals",
    description: "Learn how to earn rewards by referring others to SuoOps",
    icon: Users,
    color: "bg-orange-500",
    articles: [
      { slug: "how-referrals-work", title: "How referral rewards work" },
    ],
  },
  {
    slug: "whatsapp",
    title: "WhatsApp Bot",
    description: "Set up and use the WhatsApp bot for invoicing",
    icon: MessageSquare,
    color: "bg-green-500",
    articles: [
      { slug: "setup", title: "How to connect WhatsApp" },
      { slug: "text-commands", title: "Creating invoices by texting" },
    ],
  },
  {
    slug: "inventory",
    title: "Inventory & Stock",
    description: "Track products and manage your stock levels",
    icon: Package,
    color: "bg-orange-500",
    articles: [
      { slug: "track-stock", title: "Track your inventory and stock levels" },
      { slug: "low-stock-alerts", title: "Set up low-stock alerts" },
      { slug: "products", title: "Add and manage products" },
    ],
  },
  {
    slug: "tax",
    title: "Tax & Compliance",
    description: "Understanding tax exemptions and compliance in Nigeria",
    icon: Calculator,
    color: "bg-indigo-500",
    articles: [
      { slug: "exemptions", title: "Nigerian Tax Exemptions 2026 (NTA 2025)" },
    ],
  },
  {
    slug: "account",
    title: "Account & Security",
    description: "Manage your account settings, privacy, and security",
    icon: Shield,
    color: "bg-red-500",
    articles: [
      { slug: "delete-account", title: "How to delete your account" },
    ],
  },
];

export default function ArticlesPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">Knowledge Base</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="mt-2 text-lg text-slate-600">
            Browse all our help articles organized by category
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.slug} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
                    <p className="mt-1 text-slate-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  {category.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/articles/${category.slug}/${article.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 hover:text-emerald-600">
                        {article.title}
                      </span>
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
