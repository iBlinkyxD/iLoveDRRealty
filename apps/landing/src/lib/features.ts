/**
 * Frontend feature flags.
 *
 * PAYPAL_ENABLED — master switch for every PayPal-related UI surface.
 * Kept OFF until the business bank account is validated and production
 * PayPal API credentials are issued. The backend PayPal integration is
 * left untouched; this only hides the client-side entry points so we
 * never render a checkout that cannot complete.
 *
 * To re-enable: flip this to `true` and set NEXT_PUBLIC_PAYPAL_CLIENT_ID.
 */
export const PAYPAL_ENABLED = false
