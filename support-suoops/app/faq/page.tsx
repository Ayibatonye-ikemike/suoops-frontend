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
        answer: "After signing up, go to Dashboard → Invoices → Create Invoice. Enter your customer details, add line items with descriptions and amounts, then click 'Create Invoice'. You can then download, email, or share via WhatsApp."
      },
      {
        question: "Is there a free trial?",
        answer: "Yes! SuoOps offers a free tier that allows you to create up to 5 invoices per month with basic features. No credit card required to get started."
      },
      {
        question: "How do I set up my business profile?",
        answer: "Go to Settings → Business Profile to add your business name, logo, address, and contact information. This information appears on all your invoices."
      },
      {
        question: "Can I use SuoOps on my phone?",
        answer: "Absolutely! SuoOps is fully responsive and works on smartphones, tablets, and computers. Simply visit suoops.com from any device."
      }
    ]
  },
  {
    title: "Invoicing",
    icon: <FileText className="h-5 w-5" />,
    faqs: [
      {
        question: "Can I customize my invoice template?",
        answer: "Yes, you can customize colors, add your logo, and configure which information appears on your invoices. Go to Settings → Invoice Settings to personalize your template."
      },
      {
        question: "How do I add VAT/Tax to invoices?",
        answer: "When creating an invoice, enable the 'Apply Tax' toggle and enter your tax rate. The tax will be automatically calculated and added to the total."
      },
      {
        question: "Can I create recurring invoices?",
        answer: "Recurring invoices are available on Pro and Business plans. Set up automatic invoice generation on a weekly, monthly, or custom schedule."
      },
      {
        question: "How do I send an invoice reminder?",
        answer: "Open the invoice and click 'Send Reminder'. You can send via email or WhatsApp. Automatic reminders can be set up in Invoice Settings."
      },
      {
        question: "Can I accept payments through invoices?",
        answer: "Yes! Connect your bank account to receive payments directly. Customers can pay via bank transfer, and payments are automatically tracked."
      }
    ]
  },
  {
    title: "Billing & Subscription",
    icon: <CreditCard className="h-5 w-5" />,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept payments via Paystack (card payments) and bank transfers. All transactions are secured with bank-level encryption."
      },
      {
        question: "How do I upgrade my plan?",
        answer: "Go to Settings → Subscription and click 'Upgrade'. Choose your preferred plan and complete the payment. The upgrade takes effect immediately."
      },
      {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel anytime from Settings → Subscription → Cancel. You'll continue to have access until the end of your billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 14-day money-back guarantee on all paid plans. Contact support within 14 days of your first payment to request a refund."
      },
      {
        question: "What happens when my subscription ends?",
        answer: "Your account reverts to the free tier. You keep all your data but can only create 5 invoices per month. Upgrade anytime to restore full access."
      }
    ]
  },
  {
    title: "Referral Program",
    icon: <Users className="h-5 w-5" />,
    faqs: [
      {
        question: "How does the referral program work?",
        answer: "Share your unique referral code with friends. When they sign up and subscribe, you get 1 free month added to your subscription. There's no limit to how many people you can refer!"
      },
      {
        question: "Where do I find my referral code?",
        answer: "Your referral code is available at Dashboard → Referrals. Click the copy button to copy your code and share it with friends."
      },
      {
        question: "When do I receive my referral reward?",
        answer: "Your free month is credited immediately after your referral's first successful payment is processed."
      },
      {
        question: "Can I use multiple referral codes?",
        answer: "No, you can only use one referral code when signing up. The code must be entered during registration."
      }
    ]
  },
  {
    title: "WhatsApp Integration",
    icon: <MessageCircle className="h-5 w-5" />,
    faqs: [
      {
        question: "How do I send invoices via WhatsApp?",
        answer: "When viewing an invoice, click 'Share via WhatsApp'. This opens WhatsApp with a pre-filled message and link to your invoice."
      },
      {
        question: "How do I receive notifications on WhatsApp?",
        answer: "Go to Settings → Notifications and enable WhatsApp notifications. Verify your phone number and reply 'YES' to the confirmation message."
      },
      {
        question: "What notifications can I receive via WhatsApp?",
        answer: "You can receive payment confirmations, payment reminders, referral notifications, and important account alerts on WhatsApp."
      },
      {
        question: "How do I stop WhatsApp notifications?",
        answer: "Reply 'STOP' to any SuoOps WhatsApp message, or toggle off WhatsApp notifications in Settings → Notifications."
      }
    ]
  },
  {
    title: "Account & Security",
    icon: <Shield className="h-5 w-5" />,
    faqs: [
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page. Enter your email and we'll send you a link to reset your password."
      },
      {
        question: "Is my data secure?",
        answer: "Yes! We use bank-level encryption (SSL/TLS) for all data transmission and storage. Your data is backed up regularly and stored securely in the cloud."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can download your invoices as PDFs. For bulk data export, contact support and we'll provide a complete export of your data."
      },
      {
        question: "How do I delete my account?",
        answer: "Go to Settings → scroll to 'Danger Zone' → Click 'Delete Account'. You'll need to type 'DELETE MY ACCOUNT' to confirm. This action is permanent and cannot be undone."
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
