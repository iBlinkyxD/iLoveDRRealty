import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of the I Love DR Realty website.',
  robots: { index: true, follow: true },
}

// Placeholder copy — replace with counsel-reviewed legal text before relying on it.
export default function Page() {
  return (
    <div className="max-w-175 mx-auto px-4 sm:px-6 py-14 sm:py-18 font-sans text-ink">
      <div className="mb-8">
        <div className="text-2.75 font-bold tracking-[.18em] uppercase text-sea mb-3">Legal</div>
        <h1 className="text-7 font-bold text-ink mb-2 tracking-[-.02em]">Terms of Service</h1>
        <p className="text-[13px] text-dim">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="listing-prose">
        <p>
          These terms govern your use of ilovedrrealty.com and any related pages operated by I
          Love DR Realty ("we", "us", "our"). By using this website, you agree to these terms.
        </p>

        <h2>Real estate guidance, not professional advice</h2>
        <p>
          Content on this website is provided for general informational purposes about real
          estate in the Dominican Republic. It is not legal, tax, financial, or engineering
          advice, and does not substitute for independent review by a qualified attorney,
          accountant, inspector, or financial advisor of your choosing. All real estate
          investments carry risk.
        </p>

        <h2>Listings and information accuracy</h2>
        <p>
          We work to keep listing details, pricing, and availability accurate, but property
          information can change without notice and should be independently verified before you
          make any decision or commitment.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse this website, including attempting to access it in a way that
          could damage, disable, or impair the site, or interfering with another user's use of
          it.
        </p>

        <h2>Communications</h2>
        <p>
          By submitting a form or messaging us on WhatsApp, you consent to being contacted by I
          Love DR Realty about your inquiry by phone, email, text, or WhatsApp.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, I Love DR Realty is not liable for any indirect
          or consequential damages arising from your use of this website or reliance on its
          content.
        </p>

        <h2>Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.</p>

        <h2>Contact us</h2>
        <p>
          Questions about these terms? Reach us at{' '}
          <a href="mailto:ilovedrrealty@gmail.com">ilovedrrealty@gmail.com</a> or{' '}
          <a href="tel:+18096108094">+1 (809) 610-8094</a>.
        </p>
      </div>
    </div>
  )
}
