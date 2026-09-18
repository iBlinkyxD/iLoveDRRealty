/**
 * Frontend feature flags.
 *
 * PAYPAL_ENABLED — master switch for every PayPal-related UI surface
 * (payout email capture, payout release/request actions, and the
 * PayPal-linked gates on listing submission).
 * Kept OFF until the business bank account is validated and production
 * PayPal API credentials are issued. The backend PayPal integration is
 * left untouched; this only hides the client-side entry points.
 *
 * To re-enable: flip this to `true`.
 */
export const PAYPAL_ENABLED = false
