"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { signIn } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-full bg-link-subtle text-link mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Admin Login</h1>
        </div>

        <form action={formAction} className="bg-bg-card border border-border-color rounded-xl p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-bg-primary border border-border-color rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-carbon-support-error" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
