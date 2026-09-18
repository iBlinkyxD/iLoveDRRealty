/**
 * Frontend feature flags.
 *
 * PAYPAL_ENABLED — master switch for every PayPal-related UI surface
 * (the PayPal checkout on rental listings).
 * Turning it on also needs NEXT_PUBLIC_PAYPAL_CLIENT_ID at build time, matching the
 * PAYPAL_CLIENT_ID / PAYPAL_MODE set on the API. Set it back to `false` to hide every
 * PayPal entry point again; the backend PayPal integration is unaffected either way.
 */
export const PAYPAL_ENABLED = true
