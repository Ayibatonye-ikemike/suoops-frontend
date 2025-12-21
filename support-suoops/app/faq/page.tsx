"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, HelpCircle, FileText, CreditCard, Users, MessageCircle, Shield } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Getting Started",
    icon: <HelpCircle className="h-5 w-5" />,
    faqs: [
      {
        question: "How do I create my first invoice?",
        answer: "You have two options: (1) From the dashboard, click 'New Invoice', fill in customer name, phone, and line items, then click 'Create'. (2) Via WhatsApp, message our bot with: 'Invoice [Name] [Phone], [Amount] [Item]' - e.g., 'Invoice Joy 08012345678, 12000 wig'."
      },
      {
        question: "Is there a free plan?",
        answer: "Yes! New users get 5 free invoices to start. After that, you can purchase invoice packs (100 invoices for ₦2,500) or subscribe to a monthly plan for additional features."
      },
      {
        question: "How do I set up my business profile?",
        answer: "Go to Settings in your dashboard. You can add your business name, upload a logo (appears on all invoices), and add your bank account details for customers to pay you."
      },
      {
        question: "Can I use SuoOps on my phone?",
        answer: "Yes! SuoOps works on any device. You can use our web dashboard at suoops.com, or create invoices directly via WhatsApp by messaging our bot."
      }
    ]
  },
  {
    title: "Invoicing",
    icon: <FileText className="h-5 w-5" />,
    faqs: [
      {
        question: "Can I add my logo to invoices?",
        answer: "Yes! Upload your business logo in Settings. It will appear on all your PDF invoices. Custom branding (colors, fonts) is available on Pro and Business plans."
      },
      {
        question: "How do I add VAT/Tax to invoices?",
        answer: "Tax features are available on Starter, Pro, and Business plans. When creating an invoice, you can enable tax calculation and the system will automatically compute VAT and development levy."
      },
      {
        question: "How do invoices get sent to customers?",
        answer: "When you include a customer's phone number, they receive a WhatsApp notification with invoice details. If you add their email, they also get an email with the PDF attached."
      },
      {
        question: "How do I track payment status?",
        answer: "View all invoices in your dashboard. Each invoice shows its status (pending, paid, etc.). When a customer pays, click 'Mark as Paid' to update the status and optionally send a receipt."
      },
      {
        question: "Can I download invoices as PDF?",
        answer: "Yes! Every invoice can be downloaded as a professional PDF. PDFs include your logo, business details, bank account info, and a QR code for payment verification."
      }
    ]
  },
  {
    title: "Billing & Subscription",
    icon: <CreditCard className="h-5 w-5" />,
    faqs: [
      {
        question: "How does billing work?",
        answer: "New users get 5 free invoices. After that, you can either buy invoice packs (100 for ₦2,500) or subscribe monthly. Invoice packs never expire - use them anytime."
      },
      {
        question: "What are the subscription plans?",
        answer: "We offer: Free (5 invoices to start), Starter (pay-as-you-go with tax features), Pro (₦5,000/month with inventory & team access), and Business (₦10,000/month with voice invoices & OCR)."
      },
      {
        question: "How do I upgrade my plan?",
        answer: "Go to Settings → Subscription and click 'Upgrade'. Choose your preferred plan and complete payment via Paystack. Your new plan activates immediately."
      },
      {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel anytime from Settings → Subscription. You keep access until the end of your billing period, then revert to the free tier."
      },
      {
        question: "What happens to my invoices if I downgrade?",
        answer: "All your data is preserved. You just won't be able to create new invoices beyond your remaining balance until you purchase more or upgrade."
      }
    ]
  },
  {
    title: "Referral Program",
    icon: <Users className="h-5 w-5" />,
    faqs: [
      {
        question: "How does the referral program work?",
        answer: "Share your unique referral code with friends. When they sign up and make their first purchase, you earn rewards. There's no limit to how many people you can refer!"
      },
      {
        question: "Where do I find my referral code?",
        answer: "Your referral code is in your dashboard under the Referrals section. Click the copy button to share it easily."
      },
      {
        question: "When do I receive my referral reward?",
        answer: "Rewards are credited after your referral makes their first successful payment or purchase."
      },
      {
        question: "Can I use multiple referral codes?",
        answer: "No, you can only use one referral code when signing up. The code must be entered during registration."
      }
    ]
  },
  {
    title: "WhatsApp Bot",
    icon: <MessageCircle className="h-5 w-5" />,
    faqs: [
      {
        question: "How do I connect my WhatsApp?",
        answer: "Go to Settings in your dashboard and enter your WhatsApp phone number (with country code, e.g., +2348012345678). Save, then message the SuoOps bot to start creating invoices."
      },
      {
        question: "How do I create invoices via WhatsApp?",
        answer: "Message the SuoOps bot with: 'Invoice [Customer Name] [Phone], [Amount] [Item]'. Example: 'Invoice Joy 08012345678, 12000 wig'. You can also send voice notes!"
      },
      {
        question: "Why does my customer need to reply 'OK'?",
        answer: "WhatsApp requires customers to opt-in before receiving detailed messages. After they reply once, they'll automatically receive full invoice details and PDFs for future invoices."
      },
      {
        question: "What notifications do I receive on WhatsApp?",
        answer: "You receive confirmation when invoices are created and when customers confirm payment. Your customers receive invoice details and payment instructions."
      }
    ]
  },
  {
    title: "Account & Security",
    icon: <Shield className="h-5 w-5" />,
    faqs: [
      {
        question: "How do I log in?",
        answer: "Go to suoops.com and click 'Login'. You can log in with your phone number (OTP sent via WhatsApp) or with Google/email if you signed up that way."
      },
      {
        question: "Is my data secure?",
        answer: "Yes! We use bank-level encryption (SSL/TLS) for all data. Your passwords are hashed, and we never store sensitive payment card details."
      },
      {
        question: "Can I download my invoices?",
        answer: "Yes, you can download any invoice as a PDF from your dashboard. Click on an invoice and use the download button."
      },
      {
        question: "How do I delete my account?",
        answer: "Go to Settings → scroll to 'Danger Zone' → Click 'Delete Account'. You'll need to confirm by typing 'DELETE MY ACCOUNT'. This action is permanent and cannot be undone."
      }
    ]
  }
];

function FAQAccordion({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {category.faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-lg border border-slate-200 bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-900">{faq.question}</span>
            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4">
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">FAQ</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find quick answers to common questions about SuoOps. Can&apos;t find what 
            you&apos;re looking for? <Link href="/contact" className="text-emerald-600 hover:underline">Contact us</Link>.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 sticky top-20">
              {faqCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                    activeCategory === index
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className={activeCategory === index ? "text-emerald-600" : "text-slate-400"}>
                    {category.icon}
                  </span>
                  {category.title}
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600">{faqCategories[activeCategory].icon}</span>
                {faqCategories[activeCategory].title}
              </h2>
            </div>
            <FAQAccordion category={faqCategories[activeCategory]} />
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Our support team is here to help. Send us a message and we&apos;ll get back 
            to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
