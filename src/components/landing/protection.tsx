/**
 * Buyer & seller protection section.
 *
 * Our biggest under-sold value: every storefront order is held under buyer
 * protection until it's delivered — buyers pay safely, sellers get paid without
 * chargebacks. A strong section (not the hero), placed after "how it works".
 */
export function Protection() {
  return (
    <section className="bg-brand-textMuted px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-jade/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-teal">
            🛡 Buyer &amp; Seller Protection
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-brand-evergreen sm:text-4xl">
            Every order is protected — for both sides
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-charcoal/70">
            When a customer pays, the money is held safely until the item is
            delivered. Buyers shop without fear, sellers get paid without
            chargebacks.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Buyers */}
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-brand-teal/10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-jade/10 text-2xl">
                🛒
              </span>
              <h3 className="text-xl font-bold text-brand-evergreen">For buyers</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {[
                "Your money is held safely — the seller is only paid after you get your order.",
                "Pay by bank transfer, confirmed instantly. No card details stored.",
                "Something wrong? Open a dispute and get a refund if it's not resolved.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-brand-charcoal/80">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-brand-teal/10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-jade/10 text-2xl">
                🏪
              </span>
              <h3 className="text-xl font-bold text-brand-evergreen">For sellers</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {[
                "Guaranteed funds — the buyer has already paid before you ship.",
                "No card chargebacks or fraud reversals eating your revenue.",
                "Automatic daily settlement straight to your Nigerian bank account.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-brand-charcoal/80">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="mt-0.5 h-5 w-5 shrink-0 text-brand-jade"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
