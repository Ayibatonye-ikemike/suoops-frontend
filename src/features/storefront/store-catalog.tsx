"use client";

import { useEffect, useMemo, useState } from "react";

import { getConfig } from "@/lib/config";

export type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
  in_stock: boolean;
  category?: string | null;
};

type Props = {
  slug: string;
  storeName: string;
  products: StoreProduct[];
  whatsappUrl: string | null;
  onlinePaymentsEnabled: boolean;
};

const formatCurrency = (value: number | null) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);
};

export function StoreCatalog({
  slug,
  storeName,
  products,
  whatsappUrl,
  onlinePaymentsEnabled,
}: Props) {
  const { apiBaseUrl } = getConfig();
  const storeUrl = `https://suoops.com/store/${slug}`;

  const [cart, setCart] = useState<Record<number, number>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discovery: search + category filter.
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // "Notify me when back in stock" for a sold-out product.
  const [notifyFor, setNotifyFor] = useState<StoreProduct | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [products, search, activeCategory]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );
  const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
  const count = cartEntries.reduce((s, [, q]) => s + q, 0);
  const total = cartEntries.reduce(
    (s, [id, q]) => s + (productById.get(Number(id))?.price ?? 0) * q,
    0,
  );

  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));

  // Deep link from a product's scan-to-pay QR: /store/{slug}?p={id}. Pre-add
  // that product and open checkout so a customer who scanned just pays.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pid = Number(new URLSearchParams(window.location.search).get("p"));
    if (!pid) return;
    const product = productById.get(pid);
    if (product && product.in_stock) {
      setCart((c) => (c[pid] ? c : { ...c, [pid]: 1 }));
      setCheckoutOpen(true);
    }
  }, [productById]);

  const orderLink = (productName?: string, price?: number | null) => {
    if (!whatsappUrl) return null;
    const text = productName
      ? `Hi ${storeName}, I'd like to order: ${productName}${price != null ? ` (${formatCurrency(price)})` : ""}. via ${storeUrl}`
      : `Hi ${storeName}, I'd like to order from your store (${storeUrl}).`;
    return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  const canSubmit =
    customerName.trim().length > 0 &&
    customerPhone.trim().length >= 6 &&
    count > 0 &&
    !submitting;

  const submitOrder = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          items: cartEntries.map(([id, q]) => ({
            product_id: Number(id),
            quantity: q,
          })),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(data.detail || "Could not place your order. Please try again.");
      }
      const data = (await res.json()) as { authorization_url?: string };
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }
      throw new Error("Could not start payment. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Search + category filter */}
      {products.length > 4 && (
        <div className="mb-4 space-y-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${storeName}'s products…`}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
          />
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    activeCategory === c
                      ? "bg-brand-evergreen text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pb-24 sm:grid-cols-3">
        {visibleProducts.map((p) => {
          const qty = cart[p.id] ?? 0;
          return (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
            >
              <div className="aspect-square w-full bg-slate-100">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">{p.name}</h2>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-brand-evergreen">
                    {formatCurrency(p.price)}
                    {p.unit ? (
                      <span className="text-[10px] font-normal text-slate-400">/{p.unit}</span>
                    ) : null}
                  </span>
                  {!p.in_stock && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      Sold out
                    </span>
                  )}
                </div>

                {p.in_stock && onlinePaymentsEnabled ? (
                  qty > 0 ? (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-jade/10 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => dec(p.id)}
                        aria-label="Remove one"
                        className="h-6 w-6 rounded-md bg-white text-sm font-bold text-brand-jade shadow-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-brand-jade">{qty}</span>
                      <button
                        type="button"
                        onClick={() => add(p.id)}
                        aria-label="Add one"
                        className="h-6 w-6 rounded-md bg-white text-sm font-bold text-brand-jade shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => add(p.id)}
                      className="mt-2 rounded-lg bg-brand-jade py-2 text-xs font-semibold text-white transition hover:bg-brand-jadeHover"
                    >
                      Add
                    </button>
                  )
                ) : p.in_stock && orderLink(p.name, p.price) ? (
                  <a
                    href={orderLink(p.name, p.price) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-[#25D366] py-2 text-xs font-semibold text-white transition hover:bg-[#1ebe5a]"
                  >
                    Order
                  </a>
                ) : !p.in_stock ? (
                  <button
                    type="button"
                    onClick={() => setNotifyFor(p)}
                    className="mt-2 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Notify me
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating checkout bar */}
      {onlinePaymentsEnabled && count > 0 && !checkoutOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-xl bg-brand-jade px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-jadeHover"
          >
            <span>
              {count} item{count > 1 ? "s" : ""} · {formatCurrency(total)}
            </span>
            <span>Checkout →</span>
          </button>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Your order</h3>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 max-h-40 space-y-2 overflow-auto">
              {cartEntries.map(([id, q]) => {
                const p = productById.get(Number(id));
                if (!p) return null;
                return (
                  <div key={id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">
                      {q}× {p.name}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency((p.price ?? 0) * q)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
              />
              <input
                type="tel"
                inputMode="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Your phone (e.g. 08012345678)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
              />
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
            )}

            <button
              type="button"
              onClick={submitOrder}
              disabled={!canSubmit}
              className="mt-4 w-full rounded-xl bg-brand-jade py-3 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Starting secure checkout…" : `Pay ${formatCurrency(total)}`}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Secure payment · you&apos;ll get a receipt on confirmation
            </p>
          </div>
        </div>
      )}
      {/* Notify-me when back in stock */}
      {notifyFor && (
        <NotifyModal
          slug={slug}
          apiBaseUrl={apiBaseUrl}
          product={notifyFor}
          onClose={() => setNotifyFor(null)}
        />
      )}
    </>
  );
}

function NotifyModal({
  slug,
  apiBaseUrl,
  product,
  onClose,
}: {
  slug: string;
  apiBaseUrl: string;
  product: StoreProduct;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (phone.trim().length < 6) return;
    setState("saving");
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ product_id: product.id, phone: phone.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Could not save. Please try again.");
      setMessage(data.message ?? "We'll text you when it's back.");
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Notify me</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>
        {state === "done" ? (
          <p className="py-4 text-sm text-emerald-700">{message}</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{product.name}</span> is sold out.
              Drop your number and we&apos;ll text you when it&apos;s back.
            </p>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone (e.g. 08012345678)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            {state === "error" && message && (
              <p className="mt-2 text-xs text-rose-600">{message}</p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={phone.trim().length < 6 || state === "saving"}
              className="mt-4 w-full rounded-xl bg-brand-jade py-3 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "saving" ? "Saving…" : "Notify me"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
