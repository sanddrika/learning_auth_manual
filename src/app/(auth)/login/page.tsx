"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      const to = search.get("from") || "/dashboard";
      router.replace(to);
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm rounded-xl border border-gray-200/40 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
        <h1 className="mb-6 text-center text-2xl font-semibold">Sign in</h1>
        {/* onSubmit calls our function when the user clicks the button */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium opacity-80"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300/60 bg-white/90 px-3 py-2 text-sm outline-none ring-0 transition focus:border-gray-400 dark:border-white/20 dark:bg-black/40"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium opacity-80"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300/60 bg-white/90 px-3 py-2 text-sm outline-none ring-0 transition focus:border-gray-400 dark:border-white/20 dark:bg-black/40"
              placeholder="••••••••"
            />
          </div>
          {/* The button is disabled while loading so the user can't double-submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs opacity-70">
          Don’t have an account?{" "}
          <a className="underline" href="/register">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
