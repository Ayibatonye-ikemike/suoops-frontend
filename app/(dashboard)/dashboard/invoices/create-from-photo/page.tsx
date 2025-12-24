/**
 * OCR Feature Removed Page
 * Feature has been deprecated - redirects users to manual invoice creation
 */

"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OcrRemovedPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center space-x-2 text-sm text-slate-600">
          <Link href="/dashboard/invoices" className="hover:text-blue-600">
            Invoices
          </Link>
          <span>›</span>
          <span className="text-slate-900">Create Invoice</span>
        </div>

        {/* Feature Removed Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Camera className="h-8 w-8 text-slate-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Photo OCR Feature Unavailable
          </h1>
          
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            We&apos;ve temporarily removed the photo-to-invoice feature to focus on 
            improving core invoicing for small businesses. You can still create 
            invoices manually or via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/invoices/create">
              <Button className="w-full sm:w-auto">
                Create Invoice Manually
              </Button>
            </Link>
            <Link href="/dashboard/invoices">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Invoices
              </Button>
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Send a WhatsApp message like &quot;Invoice John 5000 for web design&quot; 
              to quickly create invoices on the go!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
