"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { TopUser } from "@/api/public";
import { getPublicTopUsers } from "@/api/public";

function UserCard({ user }: { user: TopUser }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition hover:bg-white/10">
      {user.logo_url ? (
        <Image
          src={user.logo_url}
          alt={user.business_name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-citrus/50"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-jade/20 text-xl font-bold text-brand-citrus ring-2 ring-brand-citrus/50">
          {user.business_name[0].toUpperCase()}
        </div>
      )}
      <h3 className="mt-3 text-sm font-semibold text-white">
        {user.business_name}
      </h3>
      {user.what_they_sell && (
        <p className="mt-1 text-xs text-white/60 line-clamp-2">
          {user.what_they_sell}
        </p>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
        <span>📄 {user.invoices_sent} invoices</span>
        <span>·</span>
        <span>Since {user.member_since}</span>
      </div>
    </div>
  );
}

export function TopUsersShowcase() {
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicTopUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section if no top users
  if (!loading && users.length === 0) return null;

  return (
    <section className="bg-brand-evergreen px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Meet businesses thriving with SuoOps
          </h2>
          <p className="mt-3 text-lg text-white/70">
            Top businesses using SuoOps to invoice, track payments, and grow
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {users.map((user) => (
              <UserCard key={user.business_name} user={user} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
