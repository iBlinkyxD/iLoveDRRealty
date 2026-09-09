import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How I Love DR Realty collects, uses, and protects your information.',
  robots: { index: true, follow: true },
}

// Placeholder copy — replace with counsel-reviewed legal text before relying on it.
export default function Page() {
  return (
    <div className="max-w-175 mx-auto px-4 sm:px-6 py-14 sm:py-18 font-sans text-ink">
      <div className="mb-8">
        <div className="text-2.75 font-bold tracking-[.18em] uppercase text-sea mb-3">Legal</div>
        <h1 className="text-7 font-bold text-ink mb-2 tracking-[-.02em]">Privacy Policy</h1>
        <p className="text-[13px] text-dim">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="listing-prose">
        <p>
          I Love DR Realty ("we", "us", "our") respects your privacy. This policy explains what
          information we collect through ilovedrrealty.com and our related pages, how we use it,
          and the choices you have.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you submit a form, request a call, or message us on WhatsApp, we collect the
          details you provide — such as your name, phone number, email address, and the
          information you share about your property interests. We also automatically collect
          basic technical data (pages visited, device/browser type, and referral information,
          including advertising identifiers such as <code>gclid</code>, <code>gbraid</code>,
          <code>wbraid</code>, and UTM campaign parameters) through analytics tools like Google
          Ads/Analytics.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your inquiry and follow up about buying, selling, or investing in property.</li>
          <li>To route your request to the right agent through our internal systems and CRM.</li>
          <li>To measure which marketing channels and campaigns are effective.</li>
          <li>To improve our website and services.</li>
        </ul>

        <h2>How we share information</h2>
        <p>
          We do not sell your personal information. We share it only with service providers who
          help us operate — including our customer relationship management (CRM) platform, email
          delivery provider, and hosting/analytics providers — solely to deliver the services
          described above, and with individual agents assigned to assist you.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          We use Google tag (gtag.js) to measure ad performance and conversions, such as
          completed contact forms and WhatsApp clicks originating from our ads. You can control
          cookies through your browser settings.
        </p>

        <h2>Your choices</h2>
        <p>
          You may ask us to access, correct, or delete the information we hold about you at any
          time by contacting us using the details below.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy? Reach us at{' '}
          <a href="mailto:ilovedrrealty@gmail.com">ilovedrrealty@gmail.com</a> or{' '}
          <a href="tel:+18096108094">+1 (809) 610-8094</a>.
        </p>
      </div>
    </div>
  )
}
