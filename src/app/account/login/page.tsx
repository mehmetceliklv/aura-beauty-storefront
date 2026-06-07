import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    config: 'Authentication is not yet configured. Please contact support.',
    state_mismatch: 'Security validation failed. Please try again.',
    missing_verifier: 'Session error. Please try again.',
    missing_params: 'Invalid callback. Please try again.',
    auth_failed: 'Authentication failed. Please try again.',
  }

  const error = searchParams.error
  const errorMessage = error ? (errorMessages[error] ?? 'Something went wrong.') : null

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-aura-cream">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <p className="text-[10px] tracking-[0.35em] uppercase text-aura-stone font-light mb-1">
              Aura
            </p>
            <p className="font-display text-3xl font-light text-aura-charcoal tracking-widest">
              Beauty
            </p>
          </Link>
        </div>

        <div className="bg-white px-8 py-10 shadow-sm">
          <h1 className="font-display text-2xl font-light text-aura-charcoal text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-[12px] text-aura-stone text-center mb-8">
            Sign in to your account to view orders, manage addresses, and more.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[12px]">
              {errorMessage}
            </div>
          )}

          {/* Shopify OAuth Login */}
          <a
            href="/api/auth/login"
            className="block w-full py-4 text-center text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-aura-charcoal hover:bg-aura-rose-gold transition-all duration-300"
          >
            Sign In →
          </a>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-aura-stone">
              Don&apos;t have an account?{' '}
              <a
                href="/api/auth/login"
                className="text-aura-charcoal hover:text-aura-rose-gold underline transition-colors"
              >
                Create one
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-aura-stone mt-6 tracking-wider">
          ✦ Secure authentication powered by Shopify
        </p>
      </div>
    </div>
  )
}
