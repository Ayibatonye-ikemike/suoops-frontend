import Link from "next/link";
import { ChevronRight, Package, Clock, Image as ImageIcon, DollarSign, Tag } from "lucide-react";

export default function ProductsArticle() {
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
          <span className="text-slate-900">Products</span>
        </nav>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
              <Package className="h-3 w-3" />
              Inventory
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              5 min read
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Add and Manage Products
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Create your product catalog with prices, stock quantities, and images. Invoice faster by selecting from your saved products.
          </p>
        </div>

        {/* Key Benefit */}
        <div className="mb-8 rounded-xl bg-emerald-50 border border-emerald-200 p-6">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-1">Invoice in Seconds</h3>
              <p className="text-sm text-emerald-800">
                Instead of typing product names and prices every time, just select from your catalog. 
                Suoops automatically fills in all the details.
              </p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate prose-emerald max-w-none">
          <h2>What is a Product?</h2>
          <p>
            A product is any physical item or service you sell regularly. By saving products in Suoops:
          </p>
          <ul>
            <li><strong>Invoice faster</strong> - Pick from a list instead of typing each time</li>
            <li><strong>Consistent pricing</strong> - Everyone sees the same price</li>
            <li><strong>Track inventory</strong> - Know how much stock you have</li>
            <li><strong>See best sellers</strong> - Know which products make the most money</li>
          </ul>

          <h2>How to Add a Product</h2>

          <h3>Step 1: Go to Inventory</h3>
          <ol>
            <li>Log in to your Suoops dashboard</li>
            <li>Click <strong>&quot;Inventory&quot;</strong> in the sidebar</li>
            <li>Click the <strong>&quot;Add Product&quot;</strong> button</li>
          </ol>

          <h3>Step 2: Fill in Product Details</h3>
          
          <div className="not-prose space-y-4 my-6">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Product Name (Required)</p>
                  <p className="text-xs text-slate-600">
                    What you&apos;re selling. Be clear and specific.<br />
                    <strong>Good:</strong> &quot;Premium Hair Gel - 500ml&quot;<br />
                    <strong>Avoid:</strong> &quot;Hair stuff&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Price (Required)</p>
                  <p className="text-xs text-slate-600">
                    How much per unit in Naira (₦).<br />
                    <strong>Example:</strong> ₦2,500 or ₦50,000
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Stock Quantity (Optional)</p>
                  <p className="text-xs text-slate-600">
                    How many units you currently have.<br />
                    Leave blank if you don&apos;t want to track inventory for this product.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Product Image (Optional)</p>
                  <p className="text-xs text-slate-600">
                    Upload a photo so you (and your team) can quickly identify the product.<br />
                    <strong>Tip:</strong> Use clear, well-lit photos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3>Step 3: Advanced Options (Optional)</h3>
          
          <p>
            Click <strong>&quot;Show Advanced Options&quot;</strong> to add:
          </p>
          <ul>
            <li><strong>SKU/Product Code</strong> - Internal reference number</li>
            <li><strong>Description</strong> - Details about the product (appears on invoices)</li>
            <li><strong>Category</strong> - Group similar products (e.g., &quot;Hair Products&quot;, &quot;Skincare&quot;)</li>
            <li><strong>Unit of Measure</strong> - &quot;pcs&quot;, &quot;kg&quot;, &quot;liters&quot;, etc.</li>
            <li><strong>Low Stock Alert</strong> - Get notified when stock drops below this number</li>
            <li><strong>Tax Exempt</strong> - Toggle if this product shouldn&apos;t have tax applied</li>
          </ul>

          <h3>Step 4: Save Product</h3>
          <p>
            Click <strong>&quot;Save Product&quot;</strong> and it&apos;s added to your catalog!
          </p>

          <h2>Using Products When Invoicing</h2>
          <p>
            Now when you create an invoice:
          </p>
          <ol>
            <li>Click <strong>&quot;New Invoice&quot;</strong></li>
            <li>In the line items section, click <strong>&quot;Add from Inventory&quot;</strong></li>
            <li>Select your product from the list</li>
            <li>Suoops fills in:
              <ul>
                <li>Product name</li>
                <li>Unit price</li>
                <li>Description (if you added one)</li>
              </ul>
            </li>
            <li>Enter the quantity</li>
            <li>Done! Line item is added.</li>
          </ol>

          <div className="not-prose my-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Mix and Match
                </p>
                <p className="text-sm text-blue-800">
                  You can add multiple products to one invoice. Select product A (2 units), 
                  product B (5 units), etc. Suoops calculates the total automatically.
                </p>
              </div>
            </div>
          </div>

          <h2>Managing Existing Products</h2>

          <h3>Edit a Product</h3>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Click on the product you want to edit</li>
            <li>Click <strong>&quot;Edit Product&quot;</strong></li>
            <li>Update any details (name, price, stock, etc.)</li>
            <li>Click <strong>&quot;Save Changes&quot;</strong></li>
          </ol>

          <p className="text-sm text-slate-600 italic">
            Note: Price changes only affect new invoices. Existing invoices keep the old price.
          </p>

          <h3>Delete a Product</h3>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Click on the product</li>
            <li>Scroll down and click <strong>&quot;Delete Product&quot;</strong></li>
            <li>Confirm deletion</li>
          </ol>

          <p className="text-sm text-slate-600 italic">
            Note: You can&apos;t delete products that have been used in invoices. Instead, mark them as 
            &quot;Inactive&quot; to hide them from your active catalog.
          </p>

          <h3>Mark as Inactive</h3>
          <p>
            For products you no longer sell but want to keep in your records:
          </p>
          <ol>
            <li>Edit the product</li>
            <li>Toggle <strong>&quot;Active&quot;</strong> to OFF</li>
            <li>Save</li>
          </ol>
          <p>
            Inactive products don&apos;t show up when creating invoices, but you can still view historical data.
          </p>

          <h2>Product Categories</h2>
          <p>
            Organize products by category for easier browsing:
          </p>

          <h3>Create Categories</h3>
          <ol>
            <li>Go to <strong>Inventory</strong> → <strong>&quot;Categories&quot;</strong> tab</li>
            <li>Click <strong>&quot;Add Category&quot;</strong></li>
            <li>Name it (e.g., &quot;Hair Products&quot;, &quot;Electronics&quot;, &quot;Services&quot;)</li>
            <li>Save</li>
          </ol>

          <h3>Assign Products to Categories</h3>
          <ol>
            <li>Edit any product</li>
            <li>Select a category from the dropdown</li>
            <li>Save</li>
          </ol>

          <p>
            Now when invoicing, you can filter by category to find products faster.
          </p>

          <h2>Bulk Actions</h2>
          <p>
            Need to update many products at once?
          </p>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Check the boxes next to products you want to update</li>
            <li>Click <strong>&quot;Bulk Actions&quot;</strong> at the top</li>
            <li>Choose an action:
              <ul>
                <li><strong>Update Prices</strong> - Apply a percentage increase/decrease</li>
                <li><strong>Change Category</strong> - Move to different category</li>
                <li><strong>Set Low Stock Alert</strong> - Apply same threshold to all</li>
                <li><strong>Mark as Inactive</strong> - Hide multiple products</li>
              </ul>
            </li>
          </ol>

          <h2>Import Products from a File</h2>
          <p>
            Have many products to add? Upload a CSV file:
          </p>
          <ol>
            <li>Go to <strong>Inventory</strong></li>
            <li>Click <strong>&quot;Import Products&quot;</strong></li>
            <li>Download the CSV template</li>
            <li>Fill in your products (name, price, stock, etc.)</li>
            <li>Upload the completed file</li>
            <li>Review and confirm the import</li>
          </ol>

          <div className="not-prose my-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-900 font-medium mb-1">
              CSV Format Tips
            </p>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Use UTF-8 encoding to avoid character issues</li>
              <li>• Don&apos;t change the column headers</li>
              <li>• Leave empty cells for optional fields</li>
              <li>• Test with 5-10 products first before importing hundreds</li>
            </ul>
          </div>

          <h2>Product Reports</h2>
          <p>
            See how your products are performing:
          </p>

          <h3>Best Sellers Report</h3>
          <ol>
            <li>Go to <strong>Reports</strong> → <strong>&quot;Product Performance&quot;</strong></li>
            <li>See products ranked by:
              <ul>
                <li>Total revenue generated</li>
                <li>Units sold</li>
                <li>Number of invoices</li>
              </ul>
            </li>
          </ol>

          <h3>Inventory Valuation</h3>
          <ol>
            <li>Go to <strong>Reports</strong> → <strong>&quot;Inventory Value&quot;</strong></li>
            <li>See total value of your stock (quantity × price)</li>
            <li>Useful for accounting and insurance purposes</li>
          </ol>

          <h2>Common Questions</h2>

          <h3>Can I have the same product at different prices?</h3>
          <p>
            Yes! Create separate product entries:
          </p>
          <ul>
            <li>&quot;Hair Gel - Wholesale&quot; at ₦1,500</li>
            <li>&quot;Hair Gel - Retail&quot; at ₦2,500</li>
          </ul>

          <h3>What if I sell services, not products?</h3>
          <p>
            Services work the same way! Just add them as products:
          </p>
          <ul>
            <li>&quot;Website Design - Basic Package&quot; - ₦150,000</li>
            <li>&quot;Social Media Management - Monthly&quot; - ₦50,000</li>
          </ul>
          <p>
            Leave the stock quantity blank since services don&apos;t have inventory.
          </p>

          <h3>Can I add custom fields to products?</h3>
          <p>
            Not yet, but you can use the <strong>Description</strong> field to add extra details 
            like color, size, variant, etc.
          </p>

          <h3>Do product images appear on invoices?</h3>
          <p>
            Images help you find products quickly in your catalog. They don&apos;t appear on 
            customer invoices (keeps invoices clean and professional).
          </p>

          <h2>Best Practices</h2>

          <h3>1. Use Clear, Descriptive Names</h3>
          <p>
            Good names help you and your customers understand exactly what&apos;s being sold.
          </p>
          <ul>
            <li><strong>Good:</strong> &quot;MacBook Pro 14-inch M3 - Space Gray&quot;</li>
            <li><strong>Avoid:</strong> &quot;Laptop&quot;</li>
          </ul>

          <h3>2. Keep Prices Updated</h3>
          <p>
            Review your product prices monthly. Update when:
          </p>
          <ul>
            <li>Supplier prices change</li>
            <li>You adjust your profit margins</li>
            <li>Seasonal pricing kicks in</li>
          </ul>

          <h3>3. Add Product Images</h3>
          <p>
            Especially helpful if:
          </p>
          <ul>
            <li>You have a large catalog</li>
            <li>Multiple team members create invoices</li>
            <li>Products look similar (different sizes of same item)</li>
          </ul>

          <h3>4. Use Categories Wisely</h3>
          <p>
            Don&apos;t create too many categories. Keep it simple:
          </p>
          <ul>
            <li>5-10 categories is usually enough</li>
            <li>Group by customer type or product type</li>
            <li>Examples: &quot;Retail Products&quot;, &quot;Wholesale Items&quot;, &quot;Services&quot;</li>
          </ul>

          <h3>5. Archive Old Products</h3>
          <p>
            Instead of deleting, mark as inactive. You&apos;ll still have records of past sales 
            but won&apos;t see them when creating new invoices.
          </p>
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
              href="/articles/inventory/low-stock-alerts"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Set up low-stock alerts
            </Link>
            <Link 
              href="/articles/getting-started/first-invoice"
              className="flex items-center gap-3 text-sm text-emerald-600 hover:underline"
            >
              <ChevronRight className="h-4 w-4" />
              Create your first invoice with products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
