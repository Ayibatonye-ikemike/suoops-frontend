import Link from "next/link";
import { ChevronRight, Bell, Clock, AlertTriangle } from "lucide-react";

export default function LowStockAlertsArticle() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/articles/inventory" className="hover:text-emerald-600">Inventory</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Low Stock Alerts</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
              <Bell className="h-3 w-3" />
              Inventory
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              3 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Set Up Low-Stock Alerts
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Get notified before you run out of products. Never turn away customers because you didn&apos;t know stock was low.
          </p>
        </div>

        {/* Key Benefit */}
        <div className="mb-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-1">Proactive, Not Reactive</h3>
              <p className="text-sm text-emerald-800">
                Don&apos;t wait until you&apos;re out of stock. Get alerted days in advance so you have time to restock without interrupting sales.
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>What Are Low-Stock Alerts?</h2>
          <p>
            Low-stock alerts notify you when a product drops below a certain quantity. For example, 
            if you set an alert at 5 units, you&apos;ll get notified as soon as stock reaches 5 or below.
          </p>
          <p>
            This gives you time to:
          </p>
          <ul>
            <li>Order more from your supplier</li>
            <li>Produce or source more inventory</li>
            <li>Warn customers if there&apos;s a delay</li>
          </ul>

          <h2>How to Set Up Alerts</h2>

          <h3>When Adding a New Product</h3>
          <ol>
            <li>Go to <strong>Inventory</strong> → Click <strong>&quot;Add Product&quot;</strong></li>
            <li>Fill in product name, price, and initial stock</li>
            <li>Look for <strong>&quot;Low Stock Alert Threshold&quot;</strong> field</li>
            <li>Enter the number (e.g., 5 units)</li>
            <li>Save the product</li>
          </ol>

          <h3>For Existing Products</h3>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Click on the product you want to set up alerts for</li>
            <li>Click <strong>&quot;Edit Product&quot;</strong></li>
            <li>Update the <strong>&quot;Low Stock Alert Threshold&quot;</strong></li>
            <li>Click <strong>&quot;Save Changes&quot;</strong></li>
          </ol>

          <div className="not-prose my-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Update Multiple Products
                </p>
                <p className="text-sm text-blue-800">
                  You can set alert thresholds for each product individually when adding or editing them.
                </p>
              </div>
            </div>
          </div>

          <h2>How Alerts Work</h2>
          
          <h3>When Stock Drops Below Threshold</h3>
          <p>
            When a product drops to or below your alert threshold:
          </p>
          <ul>
            <li><strong>Low Stock badge</strong> - Product shows a &quot;Low Stock&quot; label in your inventory</li>
            <li><strong>Visual indicator</strong> - Easy to spot which products need restocking</li>
          </ul>

          <h3>Example Scenario</h3>
          <div className="not-prose my-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-sm text-slate-900 mb-2">
              <strong>Product:</strong> Premium Hair Gel<br />
              <strong>Current Stock:</strong> 12 units<br />
              <strong>Alert Threshold:</strong> 5 units
            </p>
            <p className="text-sm text-slate-600 mb-3">
              You sell 8 bottles to a customer. Stock drops to 4.
            </p>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-medium">Low Stock Alert!</p>
                <p className="text-sm text-amber-800">
                  Premium Hair Gel is low: 4 units remaining. Time to restock.
                </p>
              </div>
            </div>
          </div>

          <h2>Choosing the Right Threshold</h2>
          <p>
            Setting the right threshold depends on your business. Consider:
          </p>

          <h3>1. Lead Time for Restocking</h3>
          <ul>
            <li><strong>Next-day delivery from supplier?</strong> Set threshold to 2-3 units</li>
            <li><strong>1-2 weeks to restock?</strong> Set threshold to 10-15 units</li>
            <li><strong>Need to import or manufacture?</strong> Set threshold higher (20-30 units)</li>
          </ul>

          <h3>2. Sales Velocity</h3>
          <ul>
            <li><strong>Sell 1-2 per week?</strong> Threshold of 3-5 is safe</li>
            <li><strong>Sell 10+ per week?</strong> Set threshold to 15-20</li>
            <li><strong>Best-seller moving fast?</strong> Set threshold to 2-3 weeks of sales</li>
          </ul>

          <h3>3. Seasonality</h3>
          <ul>
            <li>Increase threshold before busy seasons (holidays, events)</li>
            <li>Lower threshold during slow periods</li>
          </ul>

          <div className="not-prose my-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm text-emerald-900 font-medium mb-1">
                  Rule of Thumb
                </p>
                <p className="text-sm text-emerald-800">
                  Set your threshold to cover <strong>restock lead time + 1 week buffer</strong>. 
                  If it takes 2 weeks to restock and you sell 5 per week, set threshold to 15 units (3 weeks).
                </p>
              </div>
            </div>
          </div>

          <h2>Managing Alerts</h2>

          <h3>View All Low-Stock Products</h3>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Look for products showing the &quot;Low Stock&quot; badge</li>
            <li>Click on any product to view details or restock</li>
          </ol>

          <h2>Common Questions</h2>

          <h3>Can I turn off alerts for specific products?</h3>
          <p>
            Yes! Set the threshold to 0 for products you don&apos;t need alerts for. This is useful for:
          </p>
          <ul>
            <li>Services (not physical products)</li>
            <li>Products you always keep in stock</li>
            <li>One-time items you won&apos;t restock</li>
          </ul>

          <h3>What happens when stock is low?</h3>
          <p>
            When a product drops below its alert threshold:
          </p>
          <ul>
            <li>The product shows a &quot;Low Stock&quot; badge in your inventory</li>
            <li>You can still create invoices for the remaining stock</li>
            <li>Once stock reaches zero, the product shows as &quot;Out of Stock&quot;</li>
          </ul>

          <h3>Can I get alerts before I completely run out?</h3>
          <p>
            That&apos;s exactly what low-stock alerts do! They warn you <em>before</em> reaching zero. 
            Once you hit zero, you&apos;ll see an &quot;Out of Stock&quot; status instead.
          </p>

          <h2>Best Practices</h2>

          <h3>1. Review Your Inventory Regularly</h3>
          <p>
            Check your inventory page regularly to:
          </p>
          <ul>
            <li>Spot products that are running low</li>
            <li>Plan your restocking orders</li>
            <li>Adjust thresholds based on actual sales patterns</li>
          </ul>

          <h3>2. Set Smart Thresholds</h3>
          <p>
            When setting your low-stock threshold, consider:
          </p>
          <ul>
            <li>How long it takes to get more stock from your supplier</li>
            <li>How quickly the product typically sells</li>
            <li>A buffer for unexpected demand spikes</li>
          </ul>

          <h3>3. Communicate with Customers</h3>
          <p>
            If a popular item is low and restocking is delayed:
          </p>
          <ul>
            <li>Inform customers upfront when they order</li>
            <li>Consider pre-orders for when stock arrives</li>
          </ul>
        </article>

        {/* Next Steps */}
        <div className="mt-12 rounded-xl bg-slate-50 border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
          <div className="space-y-3">
            <Link 
              href="/articles/inventory/track-stock"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Track your inventory and stock levels
            </Link>
            <Link 
              href="/articles/inventory/products"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Add and manage products
            </Link>
            <Link 
              href="/contact"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Contact support for help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
