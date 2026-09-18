/**
 * Frontend feature flags.
 *
 * PAYPAL_ENABLED — master switch for every PayPal-related UI surface
 * (payout email capture, payout release/request actions, and the
 * PayPal-linked gates on listing submission).
 * Must be kept in step with the landing app's flag. Set it back to `false` to hide
 * every PayPal entry point again; the backend PayPal integration is unaffected either way.
 */
export const PAYPAL_ENABLED = true
