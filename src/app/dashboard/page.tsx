"use client";

import { useEffect, useState } from "react";

type Me = { id: string; name: string; email: string } | null;

export default function Page() {
  const [me, setMe] = useState<Me>(null);
  useEffect(() => {
    fetch("/api/me").then(async (r) => {
      if (!r.ok) return setMe(null);
      setMe(await r.json());
    });
  }, []);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
        {me ? (
          <div className="space-y-1 rounded-md border border-gray-200/50 p-4 dark:border-white/10">
            <div className="text-sm opacity-70">Signed in as</div>
            <div className="text-lg font-medium">{me.name}</div>
            <div className="text-sm">{me.email}</div>

            <form action="/api/logout" method="post" className="pt-4">
              <button className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}
