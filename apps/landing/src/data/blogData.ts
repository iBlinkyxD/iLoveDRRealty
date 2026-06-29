import { c } from '../design'

export const CATS = [
  { key: 'All',       label: 'All Guides',     icon: '📚', a: c.ink,      b: '#2a3a5e' },
  { key: 'Moving',    label: 'Moving Here',     icon: '🌴', a: c.green,    b: '#1a5128' },
  { key: 'Investing', label: 'Investing',       icon: '📈', a: c.sea,      b: '#075480' },
  { key: 'Buying',    label: 'Buying Process',  icon: '🏠', a: c.coral,    b: c.coralDeep },
  { key: 'Lifestyle', label: 'Lifestyle',       icon: '☀️', a: c.gold,     b: '#c98700' },
  { key: 'Legal',     label: 'Legal & Tax',     icon: '⚖️', a: '#7c3aed',  b: '#5b21b6' },
] as const

export type CatKey = typeof CATS[number]['key']

export function catInfo(key: string) {
  return CATS.find(c => c.key === key) ?? CATS[0]
}

export const STATS: [string, string][] = [
  ['400K+', 'Expats in DR'],
  ['$0',    'Income tax (first 20yr)'],
  ['12%',   'YoY property growth'],
  ['45 min','To 12+ countries'],
  ['$1,400','Avg monthly cost'],
]

export const STAT_COLORS = [c.gold, c.coral, c.sea, c.green, c.gold]

// ── Blog index cards ──────────────────────────────────────────────
// The featured + editor-pick slots showcase our flagship, in-depth guides.
export const FEATURED = {
  slug: 'can-americans-buy',
  tag: 'BUYER GUIDE · 2026',
  title: 'Can Americans Buy Property in the Dominican Republic?',
  desc: 'The complete, no-fluff answer: your legal rights as a foreigner, whether you need residency, the full step-by-step process, what it costs, and the mistakes that catch US buyers off guard.',
  author: 'iLoveDRRealty Team',
  role: 'Dominican Republic real estate experts',
  read: '14 min read',
  initials: 'DR',
  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop',
}

export const EDITOR_PICKS = [
  {
    slug: 'closing-costs-dr',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80&auto=format&fit=crop',
    cat: 'Buying', icon: '🧾',
    title: 'Closing Costs in the DR, Fully Explained',
    desc: 'The 3% transfer tax, attorney fees, notary costs and annual taxes — with a worked example so you know your true all-in number before you sign.',
    author: 'iLoveDRRealty Team', read: '11 min',
  },
  {
    slug: 'punta-cana-airbnb-roi',
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80&auto=format&fit=crop',
    cat: 'Investing', icon: '📈',
    title: 'Punta Cana Airbnb Investment: Real ROI Numbers',
    desc: 'Honest 2026 market data — occupancy, nightly rates, net yields and the costs nobody mentions — so you can model a deal instead of guessing.',
    author: 'iLoveDRRealty Team', read: '13 min',
  },
]

// The filterable guides grid now showcases our generated, in-depth posts.
export const GUIDES = [
  { slug: 'can-americans-buy',     cat: 'Buying',    icon: '🏠', title: 'Can Americans Buy Property in the DR?',     desc: 'Your legal rights as a foreigner, whether you need residency, the full process, real costs, and the mistakes US buyers make.', read: '14 min', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop' },
  { slug: 'closing-costs-dr',      cat: 'Buying',    icon: '🧾', title: 'Closing Costs in the DR, Fully Explained',  desc: 'The 3% transfer tax, attorney and notary fees, annual IPI, and CONFOTUR savings — with a fully worked example.',               read: '11 min', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80&auto=format&fit=crop' },
  { slug: 'punta-cana-airbnb-roi', cat: 'Investing', icon: '📈', title: 'Punta Cana Airbnb Investment ROI (2026)',   desc: 'Real occupancy, nightly rates and net yields, the beachfront premium, and how to model a deal instead of guessing.',           read: '13 min', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&q=80&auto=format&fit=crop' },
]

// Staged for future weeks — not rendered on the blog index. To publish a post,
// move its entry back up into GUIDES. The article pages still exist in ARTICLES.
export const HIDDEN_GUIDES = [
  { slug: 'can-canadians-buy',     cat: 'Buying',    icon: '🍁', title: 'Can Canadians Buy Property in the DR?',     desc: 'Full freehold ownership, no residency needed — plus the CRA reporting and Canada–DR tax treaty details US guides skip.',       read: '12 min', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80&auto=format&fit=crop' },
  { slug: 'property-taxes-ipi',    cat: 'Legal',     icon: '🧮', title: 'DR Property Taxes & IPI, Explained',        desc: 'The 1% IPI tax, the 2026 exemption threshold, payment dates, a worked example, and how CONFOTUR zeroes it out.',               read: '11 min', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&q=80&auto=format&fit=crop' },
  { slug: 'las-terrenas',          cat: 'Moving',    icon: '🏖️', title: 'Living in Las Terrenas: Expat Guide',       desc: "The DR's most European-flavored beach town — community, cost of living, beaches, and what real estate really costs.",          read: '12 min', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80&auto=format&fit=crop' },
  { slug: 'best-places-to-retire', cat: 'Lifestyle', icon: '🌅', title: 'Best Places to Retire in the DR',           desc: 'Top retirement towns compared, plus how the Pensionado visa works and what retirement really costs in 2026.',                  read: '13 min', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80&auto=format&fit=crop' },
  { slug: 'dr-real-estate-safe',   cat: 'Buying',    icon: '🛡️', title: 'Is DR Real Estate Safe? Scams to Avoid',    desc: 'The real risks are paperwork, not crime. The top scams foreign buyers face — and the due diligence that stops them.',          read: '12 min', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80&auto=format&fit=crop' },
  { slug: 'living-punta-cana',     cat: 'Moving',    icon: '🌴', title: 'Living in Punta Cana: Complete Guide',       desc: "The DR's most turnkey base — best expat neighborhoods, cost of living, safety, and the investment market.",                    read: '13 min', img: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500&q=80&auto=format&fit=crop' },
  { slug: 'confotur-explained',    cat: 'Legal',     icon: '🏛️', title: 'CONFOTUR: 15 Years of Tax-Free Property',   desc: 'The biggest tax break in DR real estate — what it waives, how much it saves, who qualifies, and how to verify it.',            read: '11 min', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80&auto=format&fit=crop' },
  { slug: 'dr-vs-miami',           cat: 'Investing', icon: '⚖️', title: 'Dominican Republic vs Miami: Investor Case', desc: 'A head-to-head on entry price, yields, taxes and risk — and an honest take on which market fits which investor.',               read: '12 min', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80&auto=format&fit=crop' },
  { slug: 'living-cabarete-sosua', cat: 'Moving',    icon: '🏄', title: 'Living in Cabarete & Sosúa: North Coast',   desc: "The kitesurf capital and the DR's best-value expat town — community, cost of living, and real estate.",                       read: '12 min', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&q=80&auto=format&fit=crop' },
]

export const STEPS: [string, string, string, string][] = [
  ['01', '🔍', 'Search & discover',   'Define your goals, budget, and regions.'],
  ['02', '🤝', 'Make an offer',        'Letter of Intent, negotiation, agreed terms.'],
  ['03', '📋', 'Due diligence',        'Title search, surveys, ~30 days.'],
  ['04', '✍️', 'Promise of sale',      'Promesa de venta, 10–30% in escrow.'],
  ['05', '🏦', 'Financing',            'Local bank, international, or all-cash.'],
  ['06', '🔑', 'Closing & transfer',  'Notary, 3% transfer tax, registered title.'],
]

export const STEP_COLORS = [c.gold, c.coral, c.sea, '#7c3aed', c.green, c.gold]

export const FAQS: [string, string][] = [
  ['Can foreigners own property in the Dominican Republic?', 'Yes. Foreigners have the same property rights as Dominican citizens and can own land and real estate outright in their own name — no residency required.'],
  ['What taxes do I pay when buying property?', 'A one-time 3% transfer tax (Impuesto de Transferencia) at closing, plus an annual 1% property tax (IPI) on value above the exemption threshold. CONFOTUR-approved projects can waive these.'],
  ['How long does the buying process take?', 'Typically 30–60 days from accepted offer to title transfer, with due diligence being the longest phase at roughly 30 days.'],
  ['Do I need a Dominican attorney?', 'Strongly recommended. A local real estate attorney handles title searches, due diligence, and the closing — protecting you from boundary disputes and title defects.'],
  ['What is residency and do I need it to buy property?', 'You do NOT need residency to buy. Residency (including the Law 171-07 investor/retiree route) offers tax benefits and the right to live in the DR long-term, but ownership is open to all foreigners.'],
  ["Can I rent out my property when I'm not using it?", "Yes. Short- and long-term rentals are common, and our booking tools let owners manage availability and payments directly."],
]

export const FAQ_COLORS = [c.coral, c.sea, c.green, c.gold, '#7c3aed', c.coral]

// ── Article content model ─────────────────────────────────────────
// Rich block types let articles read like true, in-depth blog posts:
// headings, paragraphs, lists, tables, expert-tip callouts and inline
// internal links. Inline links use [[Label|page]] or [[Label|article|slug]]
// markup inside any paragraph or list item.
export type Block =
  | ['h', string]                                              // H2 section heading
  | ['h3', string]                                             // H3 sub-heading
  | ['p', string]                                              // paragraph (supports [[link]] markup)
  | ['ul', string[]]                                           // bulleted list
  | ['ol', string[]]                                           // numbered list
  | ['tip', string]                                            // expert-tip callout
  | ['table', { headers: string[]; rows: string[][] }]         // comparison table
  | ['cta', { label: string; page: string; slug?: string }]   // inline conversion button

// Kept for backwards compatibility with any external imports.
export type ArticleBody = Block

export type Faq = { q: string; a: string }

export type Article = {
  catKey: CatKey
  catLabel: string
  read: string
  reads: string
  date: string
  author: string
  role: string
  initials: string
  title: string
  lede: string
  facts: [string, string][]
  body: Block[]
  img: string
  faqs?: Faq[]
  // SEO
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export const ARTICLES: Record<string, Article> = {

  // ════════════════════════════════════════════════════════════════
  // FLAGSHIP 1 — Can Americans Buy Property in the DR
  // ════════════════════════════════════════════════════════════════
  'can-americans-buy': {
    catKey: 'Buying', catLabel: 'Buyer Guide', read: '14 min', reads: '—', date: 'June 29, 2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Can Americans Buy Property in the Dominican Republic? (2026 Guide)',
    lede: 'Yes — and it is more straightforward than most US buyers expect. Here is exactly how foreign ownership works, the step-by-step process, the real costs, and the mistakes that cost newcomers thousands.',
    metaTitle: 'Can Americans Buy Property in the Dominican Republic? (2026 Guide)',
    metaDescription: 'Yes, Americans can buy property in the Dominican Republic with the same rights as locals — no residency needed. Full 2026 guide: process, costs, taxes, and key pitfalls.',
    keywords: ['can americans buy property in dominican republic', 'foreigners buying property dominican republic', 'us citizen buy real estate dominican republic', 'dominican republic property for foreigners'],
    facts: [['Equal rights', 'Foreigners own outright (Law 16-95)'], ['Not required', 'Residency to buy'], ['3%', 'One-time transfer tax'], ['Passport', 'Primary ID needed']],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', 'The short answer is yes. American citizens can buy property in the Dominican Republic with exactly the same rights as Dominican nationals. There is no special permit, no local-partner requirement, and no need to be a resident. You can fly in on a tourist entry, sign a purchase contract, and hold the title in your own name.'],
      ['p', "That said, \"you can\" and \"you should do it blindly\" are very different things. The DR does not use the title-insurance and escrow-company system Americans are used to back home — here, your attorney is your protection. This guide walks through how foreign ownership actually works, the full buying process, what it costs all-in, and the specific errors that catch US buyers."],

      ['h', 'Do Americans really have the same property rights?'],
      ['p', "Yes. Under the Dominican Republic's foreign-investment law (Law 16-95), international buyers are granted the same treatment as national investors. In practice that means you can own land, condos, villas, and commercial property outright — freehold — with no restriction on the type or location of the property, including beachfront."],
      ['p', "There is also no currency control blocking you from taking your money back out. Rental income and the proceeds from an eventual sale can be repatriated. This is one of the reasons the DR has become a magnet for North American buyers compared with countries that restrict foreign ownership near the coast or require complex trust structures."],
      ['tip', "You do not need a Dominican corporation to buy a home for personal use. Companies are sometimes used for tax or estate-planning reasons on investment portfolios — but for a single villa or condo, individual ownership in your own name is usually simpler and cheaper. Ask an attorney before defaulting to a corporate structure."],

      ['h', 'Do you need residency or a visa to buy?'],
      ['p', "No. This is the single most common misconception. Residency and property ownership are completely separate tracks. You can buy as a non-resident tourist, and many owners never become residents at all — they simply visit on tourist entries and rent the property out the rest of the year."],
      ['p', "Residency does matter for a different reason: long-term living and taxes. If you plan to actually move to the DR, the investor and retiree routes — including the well-known Law 171-07 incentives — can deliver decades of tax exemptions. But that is a lifestyle decision layered on top of ownership, not a prerequisite for it. If residency is on your radar, [[our bilingual team can map the right route|contact]] for your situation."],

      ['h', 'The step-by-step buying process'],
      ['p', "From a high level, a Dominican purchase moves through six stages. Budget roughly 30 to 60 days from an accepted offer to a registered title, with due diligence being the longest single phase."],
      ['ol', [
        'Define your goal and shortlist. Decide whether this is a lifestyle home, a pure rental investment, or both — it changes which region and property type fit. Start narrowing with our [[property search|search]].',
        'Make an offer. Once you agree on price, your attorney prepares (or reviews) a Letter of Intent or reservation agreement, usually with a small refundable reservation deposit to take the property off the market.',
        'Due diligence. Your attorney runs a title search at the Title Registry (Registro Inmobiliario / Conservaduría de Hipotecas) to confirm clean ownership, no liens or mortgages, correct boundaries, and that property taxes are current. This is the stage that protects you — never skip or rush it.',
        'Promise of Sale (Promesa de Venta). A binding bilingual contract setting out price, payment schedule, closing date and penalties. You typically place 10–30% in escrow at this point.',
        'Arrange the balance. Pay in cash (most common for foreigners) or close on financing. Local-bank mortgages for non-residents exist but are limited and carry higher rates.',
        'Closing and transfer. The final Deed of Sale (Contrato de Venta) is signed before a Notary, the transfer tax is paid, and the title is filed at the Registry so the property is recorded in your name.',
      ]],

      ['h', 'What documents do Americans need?'],
      ['p', "The paperwork burden on the buyer is light compared with a US purchase. At minimum, expect to provide:"],
      ['ul', [
        'A valid passport (your primary ID for the entire transaction).',
        'A second form of ID in many cases — the Title Registry asks for identity documents, not proof of residency.',
        'A local tax ID number (RNC), which your attorney can arrange so the purchase and any future rental income can be properly registered.',
        'Funds documentation from your bank if wiring a large sum, to satisfy anti-money-laundering checks on both ends.',
      ]],
      ['p', "Notice what is not on the list: residency, a Dominican credit history, or a local sponsor. The friction is far lower than buyers expect."],

      ['h', 'What does it cost to buy?'],
      ['p', "Beyond the purchase price, plan for roughly 4–5% in one-time closing costs. The two big line items are the 3% transfer tax and your attorney's fee. Here is the typical breakdown:"],
      ['table', {
        headers: ['Cost', 'Typical amount', 'Notes'],
        rows: [
          ['Transfer tax (Impuesto de Transferencia)', '3% of value', 'Paid at closing; based on the higher of price or the DGII appraised value'],
          ["Attorney's fees", '~1% – 1.5%', 'Covers due diligence, contracts, and the closing; the most important money you spend'],
          ['Notary & registration', '~0.25% – 1%', 'Notarization of the deed plus filing at the Title Registry'],
          ['Annual property tax (IPI)', '1% / year', 'Only on value above the exemption threshold; many homes fall under it'],
        ],
      }],
      ['p', "We break every one of these down — with a fully worked example on a real purchase price — in our dedicated guide to [[closing costs in the DR|article|closing-costs-dr]]. And if a property is part of a CONFOTUR-approved tourism project, the transfer tax and several years of property tax can be waived entirely, which materially changes the math."],
      ['cta', { label: 'Estimate your all-in costs with the ROI calculator', page: 'calculator' }],

      ['h', 'Can Americans get a mortgage in the DR?'],
      ['p', "Most foreign buyers pay cash, and the market is built around that. Local banks do lend to non-residents, but loan-to-value ratios are lower (often 50–70%), interest rates are higher than US rates, and the approval process is slower and document-heavy. Some buyers instead unlock equity at home — for example via a HELOC on a US property — and arrive as cash buyers, which also strengthens negotiating power."],
      ['tip', "If financing is essential to your plan, get pre-qualified before you fall in love with a specific property. Knowing your true budget — including the higher rates and shorter terms common here — prevents heartbreak and keeps your offer credible."],

      ['h', 'Is it safe? The real risks (and how to avoid them)'],
      ['p', "The DR is a safe place to own property — the risks that actually hurt foreign buyers are almost never about crime. They are about title and process. Because there are no title-insurance companies doing the verification for you, the responsibility shifts to your attorney. The most common ways people get burned:"],
      ['ul', [
        'Skipping an independent attorney and relying on the seller’s or developer’s lawyer — a clear conflict of interest.',
        'Paying a deposit before a clean title search is complete. Money should sit in escrow, released against verified milestones.',
        'Buying land or off-plan without confirming the developer’s title, permits, and delivery track record.',
        'Trusting a verbal boundary instead of a registered survey, then discovering the lot is smaller than advertised.',
      ]],
      ['p', "Every one of these is preventable with proper due diligence. That is also why we verify the listings on our platform and work with a vetted bilingual attorney network — so the process protects you instead of testing you. When you are ready, [[browse verified listings|search]] or [[talk to our team|contact]] to start safely."],

      ['h', 'Mistakes American buyers make most often'],
      ['ol', [
        'Assuming the US closing process applies. There is no escrow company or title insurer by default — your attorney fills that role, so choosing the right one is the most important decision you make.',
        'Underbudgeting closing costs. Build in that 4–5% from the start rather than being surprised at signing.',
        'Confusing residency with ownership and over-engineering a corporate structure they do not need.',
        'Buying purely on vacation emotion. The villa that feels magical in February still has to make sense as a year-round asset.',
      ]],

      ['h', 'The bottom line'],
      ['p', "Americans can absolutely buy property in the Dominican Republic — with full ownership rights, no residency requirement, and a process that, done correctly, is cleaner than most expect. The difference between a great purchase and an expensive lesson comes down to two things: an independent attorney and real due diligence before any money moves."],
      ['cta', { label: 'Browse verified listings', page: 'search' }],
    ],
    faqs: [
      { q: 'Can a US citizen own property in the Dominican Republic outright?', a: 'Yes. Under Law 16-95, foreigners — including US citizens — have the same ownership rights as Dominicans and can hold title to land, condos, and villas in their own name with no local partner required.' },
      { q: 'Do I need to be a resident to buy property in the DR?', a: 'No. Residency and ownership are separate. You can buy as a non-resident tourist and never become a resident. Residency only matters if you plan to live in the country long-term or pursue tax-incentive programs.' },
      { q: 'How much are closing costs for a foreign buyer?', a: 'Plan for roughly 4–5% of the purchase price in one-time costs, dominated by the 3% transfer tax and attorney fees of about 1–1.5%. CONFOTUR-approved projects can waive much of this.' },
      { q: 'Can Americans get a mortgage in the Dominican Republic?', a: 'Yes, but most foreign buyers pay cash. Local banks lend to non-residents at lower loan-to-value ratios and higher rates than in the US, with a slower, document-heavy approval process.' },
      { q: 'Is buying property in the DR safe?', a: 'Yes, when done correctly. The main risks are title and process related, not crime. Use an independent attorney, keep deposits in escrow, and complete a full title search before paying — and the transaction is very secure.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // FLAGSHIP 2 — Closing Costs in the DR
  // ════════════════════════════════════════════════════════════════
  'closing-costs-dr': {
    catKey: 'Buying', catLabel: 'Costs & Taxes', read: '11 min', reads: '—', date: 'June 29, 2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Closing Costs in the Dominican Republic, Fully Explained (2026)',
    lede: 'Before you sign, you should know your true all-in number. Here is every closing cost a foreign buyer pays — transfer tax, attorney, notary and annual taxes — with a fully worked example.',
    metaTitle: 'Dominican Republic Closing Costs Explained (2026) — Full Breakdown',
    metaDescription: 'A complete breakdown of closing costs when buying property in the Dominican Republic: the 3% transfer tax, attorney fees, notary costs, IPI property tax, plus a worked example.',
    keywords: ['closing costs dominican republic', 'dominican republic property transfer tax', 'cost of buying property dominican republic', 'IPI property tax dominican republic'],
    facts: [['~4–5%', 'Typical total closing costs'], ['3%', 'Transfer tax'], ['1–1.5%', 'Attorney fees'], ['1% / yr', 'IPI above exemption']],
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Most buyers focus entirely on the sticker price and get surprised at the closing table. In the Dominican Republic, your true all-in cost is the purchase price plus roughly 4–5% in one-time closing costs — sometimes far less if the property qualifies for a CONFOTUR exemption. This guide breaks down every line so there are no surprises."],

      ['h', 'The 3% transfer tax (Impuesto de Transferencia)'],
      ['p', "This is the largest single closing cost. The government charges a 3% property-transfer tax to record the sale and issue a new title in your name. One important nuance: the 3% is calculated on the higher of the agreed purchase price or the property's official appraised value as assessed by the tax authority (DGII). On most market-rate transactions the appraised value is at or below the price, but it is worth confirming during due diligence so the number does not surprise you."],
      ['p', "The transfer tax is typically paid by the buyer, and it is due at the time the title transfer is filed — not spread out. Budget for it as cash you need available at closing."],

      ['h', "Attorney's fees — the most important money you spend"],
      ['p', "Because the DR does not use title-insurance companies, your attorney performs the role that an escrow company, title insurer, and closing agent would split in the US. Expect fees of roughly 1% to 1.5% of the purchase price, sometimes with a minimum on lower-priced properties. For that fee your attorney should:"],
      ['ul', [
        'Run a full title search at the Title Registry to confirm clean ownership and no liens.',
        'Verify boundaries, that property taxes are current, and that there are no encumbrances.',
        'Draft or review the Promise of Sale and the final Deed of Sale.',
        'Hold deposits in escrow and manage the closing and the title filing.',
      ]],
      ['tip', "This is the wrong place to bargain-hunt. A slightly cheaper attorney who misses a lien or a boundary problem can cost you many times the fee you saved. Choose for diligence and bilingual clarity, not the lowest quote."],

      ['h', 'Notary and registration costs'],
      ['p', "The Deed of Sale must be notarized, and Dominican notaries are attorneys who charge for authenticating the document — commonly a fraction of a percent of the price. On top of that, filing the transfer at the Title Registry carries registration fees and stamp duties. Together these usually land somewhere around 0.25% to 1%, depending on the property value and the professionals involved."],

      ['h', 'Annual costs you should plan for'],
      ['p', "Closing costs are one-time, but two recurring costs matter for your budget:"],
      ['ul', [
        'IPI property tax: an annual 1% tax, but only on the portion of a property’s value above the exemption threshold (which is adjusted periodically). Many modestly priced homes fall entirely under the threshold and owe nothing; higher-value properties pay 1% on the excess. Always confirm the current threshold for the year you buy.',
        'HOA / condo fees: if you buy in a gated community or condo building, monthly maintenance fees fund security, landscaping, pools and amenities. These vary widely — confirm the exact figure before you commit, especially for a rental-investment underwrite.',
      ]],

      ['h', 'The CONFOTUR exemption — how to pay much less'],
      ['p', "If your property is part of a project approved under the CONFOTUR tourism-incentive law, the benefits are significant: the 3% transfer tax can be waived, and the annual IPI property tax can be exempt for a number of years. For a buyer, that can erase the bulk of closing costs and reduce holding costs for years."],
      ['p', "The catch is that the exemption attaches to the project, not to you personally — so verifying a development's CONFOTUR status is part of due diligence. We check CONFOTUR eligibility on qualifying listings precisely because it can swing the all-in math so much."],

      ['h', 'A worked example'],
      ['p', "Here is what the numbers look like on a US$250,000 condo bought for personal use, paid in cash, on a standard (non-CONFOTUR) transaction:"],
      ['table', {
        headers: ['Line item', 'Rate', 'Amount (USD)'],
        rows: [
          ['Purchase price', '—', '$250,000'],
          ['Transfer tax', '3%', '$7,500'],
          ["Attorney's fees", '~1.25%', '$3,125'],
          ['Notary & registration', '~0.5%', '$1,250'],
          ['Total one-time closing costs', '~4.75%', '≈ $11,875'],
          ['All-in cash needed', '—', '≈ $261,875'],
        ],
      }],
      ['p', "Now run the same property as part of a CONFOTUR-approved development: the $7,500 transfer tax can disappear, and the annual IPI may be exempt for years — turning an ~4.75% closing cost into something far smaller. That single factor is why two similar-looking condos can have very different true costs."],
      ['cta', { label: 'Model your exact numbers in the ROI calculator', page: 'calculator' }],

      ['h', 'Who pays what?'],
      ['p', "As a rule of thumb in the DR: the buyer pays the transfer tax, their own attorney, and the notary/registration costs. The seller typically covers any capital-gains tax owed on their gain and the real-estate agent's commission. These are customary, not absolute — anything can be negotiated and written into the Promise of Sale, which is exactly why that contract matters."],

      ['h', 'Bottom line'],
      ['p', "For a standard purchase, budget 4–5% on top of the price and you will be covered. The two levers that change the picture most are CONFOTUR status (which can slash costs) and your choice of attorney (which protects the entire investment). Confirm both early and there are no surprises at the table."],
      ['cta', { label: 'See how this fits the full buying process', page: 'article', slug: 'can-americans-buy' }],
    ],
    faqs: [
      { q: 'What are the total closing costs when buying property in the Dominican Republic?', a: 'Typically around 4–5% of the purchase price for a standard transaction, made up mainly of the 3% transfer tax and attorney fees of about 1–1.5%, plus notary and registration costs. CONFOTUR-approved projects can waive much of this.' },
      { q: 'Who pays the transfer tax in the DR?', a: 'The buyer customarily pays the 3% transfer tax, calculated on the higher of the purchase price or the official appraised value, and it is due when the title transfer is filed.' },
      { q: 'What is the IPI property tax?', a: 'IPI is an annual 1% property tax charged only on the value above an exemption threshold that is adjusted periodically. Many lower-priced homes fall under the threshold and owe nothing; higher-value properties pay 1% on the excess.' },
      { q: 'Can closing costs be reduced?', a: 'Yes. Properties in CONFOTUR-approved tourism developments can have the 3% transfer tax waived and the annual IPI exempt for several years, dramatically lowering both closing and holding costs.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // FLAGSHIP 3 — Punta Cana Airbnb ROI
  // ════════════════════════════════════════════════════════════════
  'punta-cana-airbnb-roi': {
    catKey: 'Investing', catLabel: 'Investment Intelligence', read: '13 min', reads: '—', date: 'June 29, 2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Punta Cana Airbnb Investment: Real ROI Numbers for 2026',
    lede: 'Forget the hype. Here is what a Punta Cana short-term rental actually earns in 2026 — occupancy, nightly rates and net yields — plus the costs that make or break a deal.',
    metaTitle: 'Punta Cana Airbnb Investment ROI 2026 — Real Numbers & Yields',
    metaDescription: 'Honest 2026 data on Punta Cana Airbnb investment: occupancy rates, nightly rates, net rental yields, the beachfront premium, costs, and how to model a realistic ROI.',
    keywords: ['punta cana airbnb investment', 'dominican republic real estate roi', 'punta cana rental yield', 'best airbnb investment dominican republic'],
    facts: [['~7%', 'Avg net rental yield'], ['$120–158', 'Typical ADR (USD)'], ['40–60%', 'Beachfront rate premium'], ['CONFOTUR', 'Can waive taxes']],
    img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Punta Cana is the most-searched short-term-rental market in the Caribbean, and the pitch is seductive: year-round sun, millions of tourists, and nightly rates in dollars. But a good investment is built on numbers, not vibes. Here is what the 2026 market data actually shows — and how to turn it into a realistic underwrite before you buy."],

      ['h', 'What does a Punta Cana rental actually earn?'],
      ['p', "Recent market data paints a clear, if sobering, picture. Across the broad Punta Cana market in 2025–2026, a typical short-term rental sees average occupancy in the low-to-high 30s percent, average daily rates around US$150–158, and average annual revenue clustered in the low five figures. The median performer earns more than the average implies, because a long tail of poorly managed or poorly located listings drags the mean down."],
      ['p', "The headline figure investors care about: a representative property modeled around a US$290,000 acquisition has shown an average pre-tax net yield in the neighborhood of 7%. That is a genuinely strong number versus prime US coastal markets, where short-term-rental yields have compressed into the low single digits — but it is an average, and averages hide the gap between the top operators and everyone else."],
      ['tip', "Top-performing listings reach 60–70% occupancy while the market average sits far lower. The difference is rarely luck — it is location, professional management, dynamic pricing, and review quality. Underwrite to the average, then treat strong management as the lever that moves you toward the top of the range."],

      ['h', 'The beachfront premium is the single biggest driver'],
      ['p', "If there is one factor that consistently separates high performers from the pack, it is proximity to the water. Properties within walking distance of the beach command nightly rates roughly 40–60% higher than comparable inland units, and they convert better because \"walk to the beach\" is what guests actually search for. That premium compounds: higher ADR plus higher occupancy on the same cost base is what turns an average yield into a strong one."],

      ['h', 'Where to buy for rental performance'],
      ['p', "Not all of Punta Cana performs equally. The strongest short-term-rental sub-markets tend to be:"],
      ['ul', [
        'Cap Cana — the luxury enclave: highest nightly rates, gated security, marina and golf, and the deepest premium for beachfront and resort-branded product.',
        'Bávaro — the dense tourism core: the most consistent guest demand and the easiest properties to keep occupied year-round.',
        'Uvero Alto — newer, quieter, resort-led growth corridor with strong rates for well-positioned beachfront stock.',
      ]],
      ['p', "Comparing regions beyond Punta Cana matters too — Las Terrenas and Cabarete offer lower entry prices with their own demand profiles. Start mapping options on our [[property search|search]] and filter by the areas that fit your strategy."],

      ['h', 'The CONFOTUR tax advantage for investors'],
      ['p', "Punta Cana has a large supply of CONFOTUR-approved developments, and for an investor the impact is direct: a waived 3% transfer tax at purchase and several years of exemption from the annual IPI property tax. Lower acquisition and holding costs feed straight into net yield. When you compare two similar units, CONFOTUR status can be the difference between an average return and a strong one — see our full breakdown of [[closing costs and CONFOTUR|article|closing-costs-dr]]."],

      ['h', 'The costs nobody puts in the brochure'],
      ['p', "Gross rental revenue is not what you keep. A realistic Punta Cana underwrite has to subtract:"],
      ['ul', [
        'Professional management: typically 20–30% of rental revenue for full short-term-rental management (guest comms, cleaning coordination, pricing, maintenance). Self-managing from abroad is rarely realistic.',
        'HOA / community fees: gated resort communities charge monthly fees for security and amenities — confirm the exact number, as it varies widely and hits net yield directly.',
        'Furnishing and setup: a rental-ready furnishing package is a real upfront cost that affects both your nightly rate and your first-year return.',
        'Utilities, internet, pool and garden upkeep, and a vacancy/maintenance reserve.',
        'Platform fees and seasonal pricing swings — high winter season subsidizes a much slower low season.',
      ]],

      ['h', 'A realistic ROI model'],
      ['p', "Here is how a disciplined investor would frame a representative deal. Treat every figure as an input to verify, not a promise:"],
      ['table', {
        headers: ['Input', 'Conservative', 'Strong (top-tier)'],
        rows: [
          ['Occupancy', '~35%', '60–70%'],
          ['Average daily rate', '$130', '$180+'],
          ['Management fee', '25% of revenue', '20% of revenue'],
          ['Indicative net yield', '~5–6%', '~9–10%'],
          ['Plus appreciation', 'Market-dependent', 'Market-dependent'],
        ],
      }],
      ['p', "The spread between those columns is the whole game. The same building, same price, can deliver a mediocre or an excellent return depending on location within the resort, the quality of management, and whether you bought CONFOTUR-exempt. That is exactly the kind of scenario our ROI calculator is built to model."],
      ['cta', { label: 'Run your own numbers in the ROI calculator', page: 'calculator' }],

      ['h', 'Mistakes investors make in Punta Cana'],
      ['ol', [
        'Underwriting to the top of the range. Model conservative occupancy first; let strong management be upside, not your base case.',
        'Ignoring management cost. A 25% management fee is the difference between a good and a great year — bake it in from day one.',
        'Buying inland to save money, then losing the beachfront premium that drives both rate and occupancy.',
        'Overlooking CONFOTUR status, and overpaying on taxes a neighboring exempt unit avoids.',
        'Forgetting seasonality. Winter highs are real, but so are slow shoulder months — annualize, do not extrapolate from peak week.',
      ]],

      ['h', 'Is a Punta Cana Airbnb a good investment in 2026?'],
      ['p', "For the right property, run the right way, yes. Net yields around 7% with dollar-denominated income, strong tourism fundamentals, and CONFOTUR tax breaks make Punta Cana one of the more compelling short-term-rental markets in the region. The risk is buying on emotion and modeling on the brochure. Buy beachfront-adjacent, verify CONFOTUR, budget honestly for management, and underwrite to conservative occupancy — then strong operations become upside rather than a rescue plan."],
      ['cta', { label: 'Browse investment listings', page: 'search' }],
    ],
    faqs: [
      { q: 'What ROI can I expect from a Punta Cana Airbnb?', a: 'Market data points to an average pre-tax net yield around 7%, with conservative properties nearer 5–6% and top-tier, well-managed beachfront units reaching 9–10%, before any appreciation. Location, management quality, and CONFOTUR status drive the spread.' },
      { q: 'What is the average occupancy and nightly rate in Punta Cana?', a: 'Average occupancy across the broad market sits in the low-to-high 30s percent with average daily rates around $150, while top performers reach 60–70% occupancy and higher rates. Beachfront proximity commands a 40–60% rate premium.' },
      { q: 'How much does property management cost?', a: 'Full short-term-rental management typically runs 20–30% of rental revenue, covering guest communication, cleaning coordination, dynamic pricing, and maintenance. It is essential for owners who live abroad and should be in every underwrite.' },
      { q: 'Does CONFOTUR help short-term rental investors?', a: 'Yes. CONFOTUR-approved developments can waive the 3% transfer tax and exempt the annual IPI property tax for several years, lowering both acquisition and holding costs and directly improving net yield.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 2 — Can Canadians Buy Property in the DR
  // ════════════════════════════════════════════════════════════════
  'can-canadians-buy': {
    catKey: 'Buying', catLabel: 'Buyer Guide', read: '12 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Can Canadians Buy Property in the Dominican Republic? (2026 Guide)',
    lede: 'Yes — Canadians get full freehold ownership with no restrictions. Here is how it works, plus the one thing US guides skip: exactly what the CRA expects you to report back home.',
    metaTitle: 'Can Canadians Buy Property in the Dominican Republic? (2026 Guide)',
    metaDescription: 'Yes, Canadians can buy property in the Dominican Republic with full freehold title and no residency requirement. 2026 guide: process, DR taxes, CONFOTUR, and CRA reporting.',
    keywords: ['can canadians buy property in dominican republic', 'canadian buying dominican republic real estate', 'dominican republic property canadian taxes', 'snowbird property dominican republic'],
    facts: [['Full freehold', 'Title in your own name'], ['Not required', 'Residency to buy'], ['1976', 'Canada–DR tax treaty'], ['CRA', 'Report worldwide income']],
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Yes. Canadians can buy property in the Dominican Republic and receive full freehold title in their own name — no trust structure, no Dominican corporation, and no residency required. Legally, a buyer from Toronto or Vancouver has exactly the same ownership rights as a Dominican citizen."],
      ['p', "The DR-side process is identical to what any foreigner follows, so this guide focuses on what is genuinely different for Canadians: the tax side. Because Canada taxes its residents on worldwide income, owning a property in the Caribbean creates obligations back home that a lot of agents conveniently skip. Here is the full picture."],

      ['h', 'The same rights as everyone else'],
      ['p', "Under the DR's foreign-investment framework (Law 16-95), international buyers are treated the same as nationals. You can own condos, villas, land, and beachfront outright, take rental income, and repatriate the proceeds of an eventual sale without currency restrictions. There is no foreign-buyer ban and no extra foreign-buyer tax — a notable contrast to the rules many Canadians now face at home."],

      ['h', 'Do Canadians need residency or a visa to buy?'],
      ['p', "No. Ownership and residency are separate. You can buy as a visiting tourist and never become a resident — which is exactly what most Canadian snowbirds do: spend the winter in their DR home and rent it out the rest of the year. The process from offer to registered title runs the same six stages every foreign buyer follows; we cover them in full in our [[step-by-step buying guide|article|can-americans-buy]]."],

      ['h', 'What it costs on the Dominican side'],
      ['p', "Budget roughly 4–5% of the price in one-time closing costs, dominated by the 3% transfer tax and attorney fees of about 1–1.5%. After purchase, the main recurring cost is the annual IPI property tax of 1% on value above the exemption threshold. We break every line down — with a worked example — in our guide to [[closing costs in the DR|article|closing-costs-dr]] and the deeper [[property taxes and IPI explainer|article|property-taxes-ipi]]."],
      ['tip', "If your property is in a CONFOTUR-approved tourism development, both the 3% transfer tax and the annual property tax can be exempt for up to 15 years. For a snowbird who rents seasonally, that exemption meaningfully lifts net returns — always confirm a project's CONFOTUR status during due diligence."],

      ['h', 'The part US guides skip: what the CRA expects'],
      ['p', "This is where Canadians differ from American buyers. As a Canadian resident, you are taxed on your worldwide income, so your DR property can touch your Canadian return in three ways:"],
      ['ul', [
        'Rental income: any rent you earn in the DR must be reported on your Canadian return (Form T776, Statement of Real Estate Rentals), even though the property and tenants are abroad.',
        'Foreign property reporting (T1135): if the cost of your specified foreign property exceeds CAD $100,000, you generally must file Form T1135. Property held purely for personal use is excluded — but once you rent it out, it typically becomes reportable. This is a key line to get right.',
        'Foreign tax credit (T2209): if you have already paid Dominican tax on that rental income, the Canada–DR double-taxation treaty (in force since 1976) lets you claim a foreign tax credit so the same income is not fully taxed twice.',
      ]],
      ['tip', "Talk to a cross-border accountant before you close, not after. The interaction between DR taxes, the treaty, T1135, and your provincial rate is very specific to your situation — a one-hour consult is cheap insurance against a filing headache."],

      ['h', 'Financing: cash vs. a mortgage'],
      ['p', "Most Canadian buyers pay cash. Dominican banks do lend to non-residents, but at lower loan-to-value ratios and higher rates than Canadians are used to, with a slower approval process. A common alternative is to draw on home equity — for example a HELOC on a Canadian property — and arrive as a cash buyer, which also strengthens your negotiating position."],

      ['h', 'Mistakes Canadian buyers make'],
      ['ol', [
        'Ignoring the Canadian side. The DR purchase can be clean and still create a T1135/T776 obligation at home — plan for it before you buy.',
        'Assuming personal-use and rental are taxed the same. The moment you list the place on Airbnb, your reporting picture changes.',
        'Skipping an independent attorney. The DR has no title-insurance companies, so your lawyer is your protection — never rely on the seller’s or developer’s lawyer.',
        'Overlooking CONFOTUR status and overpaying taxes a neighboring exempt unit avoids.',
      ]],

      ['h', 'The bottom line for Canadians'],
      ['p', "Buying in the DR is genuinely easy for Canadians — full ownership, no foreign-buyer penalties, and a warm-weather asset a short flight from home. The discipline is on the tax side: budget the DR closing costs, verify CONFOTUR, and line up a cross-border accountant so the CRA side is handled cleanly from day one."],
      ['cta', { label: 'Browse verified listings', page: 'search' }],
    ],
    faqs: [
      { q: 'Can a Canadian own property in the Dominican Republic outright?', a: 'Yes. Canadians receive full freehold title in their own name with the same rights as Dominican citizens — no trust, no corporation, and no residency required.' },
      { q: 'Do Canadians pay a foreign-buyer tax in the DR?', a: 'No. The Dominican Republic has no foreign-buyer ban or surcharge. You pay the standard 3% transfer tax that every buyer pays, plus normal closing costs.' },
      { q: 'Do I have to report my DR property to the CRA?', a: 'If you earn rental income, you report it on Form T776. If the cost of your specified foreign property exceeds CAD $100,000 and it is not purely personal-use, you generally must file Form T1135. A cross-border accountant should confirm your specific obligations.' },
      { q: 'Will I be taxed twice on rental income?', a: 'Generally no. The Canada–Dominican Republic double-taxation treaty (1976) lets you claim a foreign tax credit (Form T2209) for Dominican tax already paid, avoiding full double taxation.' },
      { q: 'Is the DR good for Canadian snowbirds?', a: 'Very. Many Canadians spend winter in their DR home and rent it seasonally the rest of the year. CONFOTUR-exempt properties can be especially efficient for this, with no transfer or property tax for up to 15 years.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 2 — Property Taxes & IPI Explained
  // ════════════════════════════════════════════════════════════════
  'property-taxes-ipi': {
    catKey: 'Legal', catLabel: 'Legal & Tax', read: '11 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Dominican Republic Property Taxes & IPI, Fully Explained (2026)',
    lede: 'How much you actually owe each year as a property owner — the 1% IPI tax, the 2026 exemption threshold, when to pay, and how CONFOTUR can zero it out entirely.',
    metaTitle: 'Dominican Republic Property Tax (IPI) Explained — 2026 Guide',
    metaDescription: 'A clear 2026 guide to Dominican Republic property taxes: the 1% annual IPI, the RD$10.7M exemption threshold, payment dates, CONFOTUR exemptions, and a worked example.',
    keywords: ['dominican republic property tax', 'IPI tax dominican republic', 'dominican republic property tax exemption 2026', 'how much is property tax in dominican republic'],
    facts: [['1%', 'Annual IPI rate'], ['RD$10.7M', '2026 exemption (~$182k)'], ['Mar 11 / Sep 11', 'Two payment dates'], ['Up to 15 yrs', 'CONFOTUR exemption']],
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Property taxes in the Dominican Republic are refreshingly simple — and for many owners, surprisingly low or even zero. The annual tax is called IPI (Impuesto al Patrimonio Inmobiliario), and it is charged at 1% per year, but only on the value above an exemption threshold. Below that threshold you owe nothing. Here is exactly how it works in 2026."],

      ['h', 'How IPI works'],
      ['p', "IPI is assessed at 1% on the portion of a property's government-appraised value that exceeds the annual exemption threshold. Anything below the threshold is tax-free; only the excess is taxed. The threshold is indexed to inflation and adjusted by the tax authority (DGII) each year."],
      ['p', "For 2026, the exemption threshold is RD$10,695,494 — roughly US$182,000 at recent exchange rates. So a single home appraised below that owes no IPI at all. Note that this exemption applies to property held by individuals; the figure is updated annually, so always confirm the current number for the year you pay."],
      ['tip', "IPI is based on the DGII's official appraised value, not necessarily your purchase price. The appraisal is often lower than market price, which is why many mid-range homes fall under the threshold and owe nothing. Your attorney can confirm the assessed value during due diligence."],

      ['h', 'A worked example'],
      ['p', "Because only the value above the threshold is taxed, the effective rate is far below 1% for most owners. Using the 2026 threshold of ~US$182,000:"],
      ['table', {
        headers: ['Appraised value', 'Taxable amount (above ~$182k)', 'Annual IPI (1%)'],
        rows: [
          ['$150,000', '$0', '$0'],
          ['$250,000', '$68,000', '≈ $680'],
          ['$400,000', '$218,000', '≈ $2,180'],
          ['$750,000', '$568,000', '≈ $5,680'],
        ],
      }],
      ['p', "Figures are illustrative and depend on the DGII appraised value and the peso-dollar rate. The takeaway holds, though: a sub-threshold home is tax-free, and even higher-value homes pay only on the excess."],

      ['h', 'When and how you pay'],
      ['p', "IPI is paid annually, typically split into two equal installments due on or before March 11 and September 11. You can pay at the DGII or online, and late payment triggers surcharges and interest — so it is worth setting a calendar reminder or having a property manager handle it. The tax is assessed per individual owner across their total qualifying real estate, not strictly per property."],

      ['h', 'The one-time transfer tax (not IPI)'],
      ['p', "Don't confuse the annual IPI with the one-time 3% transfer tax paid at purchase to register the title in your name. They are separate. We cover the full purchase-side breakdown — transfer tax, attorney, notary — in our [[closing costs guide|article|closing-costs-dr]]."],

      ['h', 'How CONFOTUR can zero out your taxes'],
      ['p', "If your property is part of a CONFOTUR-approved tourism development, the incentive is substantial: exemption from the 3% transfer tax at purchase and from the annual IPI property tax for up to 15 years. For an investor or a snowbird renting seasonally, that can erase both the upfront and the holding tax burden for over a decade — which is exactly why CONFOTUR status is worth verifying before you choose between two similar units."],

      ['h', 'Other taxes owners should know'],
      ['ul', [
        'Rental income tax: income from renting your property is taxable in the DR and should be declared. Foreign owners should also check their home-country obligations — Canadians, for example, report worldwide rental income (see our [[guide for Canadian buyers|article|can-canadians-buy]]).',
        'Capital gains on sale: when you sell, tax applies to the gain (sale price less the indexed acquisition cost and allowable expenses). Keep your purchase documents and improvement receipts to reduce the taxable gain.',
        'Hold personally where possible: the IPI exemption threshold is designed for individuals. Property held inside a company is taxed under a different regime without that personal threshold, so a corporate structure can cost you the exemption — get advice before defaulting to one.',
      ]],

      ['h', 'Bottom line'],
      ['p', "For most owners, Dominican property tax is either nothing (below the ~US$182,000 threshold) or a modest 1% on the excess — and potentially zero for up to 15 years under CONFOTUR. Budget the one-time 3% transfer tax at purchase, mark the March and September IPI dates, and verify CONFOTUR status, and there are no surprises."],
      ['cta', { label: 'Estimate your taxes and returns in the ROI calculator', page: 'calculator' }],
    ],
    faqs: [
      { q: 'How much is property tax in the Dominican Republic?', a: 'The annual IPI tax is 1%, charged only on the appraised value above the exemption threshold (RD$10,695,494, about US$182,000, for 2026). Homes below the threshold owe no property tax, and only the excess is taxed above it.' },
      { q: 'When is IPI due?', a: 'IPI is paid annually, usually in two equal installments due on or before March 11 and September 11. Late payments incur surcharges and interest.' },
      { q: 'Is the transfer tax the same as IPI?', a: 'No. The 3% transfer tax is a one-time cost at purchase to register the title. IPI is the recurring annual 1% property tax. They are separate charges.' },
      { q: 'Can I avoid property tax in the DR?', a: 'Legitimately, yes — properties below the exemption threshold owe no IPI, and CONFOTUR-approved developments are exempt from both the transfer tax and IPI for up to 15 years.' },
      { q: 'Does property tax differ for company-owned property?', a: 'Yes. The exemption threshold is designed for individuals. Property held inside a company is taxed under a different regime without that personal threshold, so corporate ownership can forfeit the exemption. Seek advice before using a corporate structure.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 2 — Living in Las Terrenas (neighborhood guide)
  // ════════════════════════════════════════════════════════════════
  'las-terrenas': {
    catKey: 'Moving', catLabel: 'Neighborhood Guide', read: '12 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Living in Las Terrenas: The Expat Guide (2026)',
    lede: "The DR's most European-flavored beach town — walkable, bohemian, and a magnet for expats. Here is who it suits, what it costs, the beaches, and what real estate really runs.",
    metaTitle: 'Living in Las Terrenas, Dominican Republic — 2026 Expat Guide',
    metaDescription: 'A complete 2026 guide to living in Las Terrenas: the expat community, cost of living, beaches, getting there, healthcare, and the real estate market for buyers and investors.',
    keywords: ['living in las terrenas', 'las terrenas dominican republic expat', 'las terrenas real estate', 'moving to las terrenas samana'],
    facts: [['~11,000', 'Expats in town'], ['20 min', 'To El Catey airport'], ['~2 hrs', 'To Santo Domingo'], ['From ~$200k', 'Beachfront condos']],
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "If Punta Cana is the DR's resort capital, Las Terrenas is its bohemian heart. Set on the Samaná Peninsula on the country's northeast coast, this once-sleepy fishing village has grown into one of the most international small towns in the Caribbean — walkable, multilingual, and built around a string of postcard beaches. It draws a very different buyer than the all-inclusive corridors, and that is precisely its appeal."],

      ['h', 'Who Las Terrenas is for'],
      ['p', "Las Terrenas tends to attract lifestyle-first buyers rather than pure-yield investors: remote workers, European and North American retirees, families, and anyone who wants a real town with cafés, bakeries, and a tight community rather than a gated resort bubble. With around 11,000 expats from more than 20 countries — historically French, Italian, Spanish, and German, and increasingly Canadian and American — you can get by in several languages, and the culture reflects that mix."],
      ['tip', "If your priority is the absolute highest short-term-rental yield, the dense Punta Cana market may out-earn Las Terrenas on pure occupancy. If you want lifestyle, walkability, and a genuine community — with solid rental upside as a bonus — Las Terrenas is hard to beat. Match the town to your goal."],

      ['h', 'The beaches'],
      ['p', "The town is defined by its coastline — over 30 km of it. The headline beaches each have their own character:"],
      ['ul', [
        'Playa Las Ballenas — the main town beach, calm and swimmable, with consistent trade winds that make it a hub for kitesurfing and windsurfing.',
        'Playa Bonita — a quieter, wider stretch a few minutes west, lined with boutique hotels and villas; a favorite for long sunset walks.',
        'Playa Cosón — a vast, undeveloped sweep of golden sand, the most dramatic in the area and home to some of the most exclusive villa enclaves.',
      ]],

      ['h', 'Getting there and infrastructure'],
      ['p', "Las Terrenas used to be remote; it no longer is. El Catey International Airport (AZS) is about 20 minutes away with seasonal direct flights to North America and Europe, and a modern toll highway connects the peninsula to Santo Domingo in roughly two hours. In town, you will find supermarkets, international restaurants, banks, reliable internet for remote work, and a growing private healthcare presence including a hospital and clinics — a key consideration for retirees."],

      ['h', 'Cost of living'],
      ['p', "Las Terrenas is more affordable than North American or European cities, though imported goods and beachfront dining can nudge a lifestyle budget up. Rough monthly guidance:"],
      ['table', {
        headers: ['Profile', 'Typical monthly budget', 'Notes'],
        rows: [
          ['Single remote worker', '~$1,500 – $2,200', 'Including rent in or near town'],
          ['Couple / retirees', '~$2,200 – $3,200', 'Comfortable, with dining out and a car'],
          ['Family with school', '~$3,500+', 'Adds international schooling and help'],
          ['2-bed rental', '~$700 – $1,200', 'Higher for beachfront or in high season'],
        ],
      }],
      ['p', "Figures vary with location and lifestyle — living a few minutes inland costs noticeably less than directly on the sand."],

      ['h', 'The real estate market'],
      ['p', "Las Terrenas spans a wide range. Modern beachfront and near-beach condos commonly start around US$200,000 and make capable seasonal rentals, while luxury villas in sought-after areas like Playa Bonita and Playa Cosón range from roughly US$400,000 to well over US$1 million. Many newer developments carry CONFOTUR status, which can waive the transfer tax and property tax for up to 15 years — a meaningful boost to investor returns."],
      ['p', "On the investment side, the town's strong expat demand supports both long-term rentals (to the resident community) and short-term vacation rentals (to a steady tourist flow). If you are weighing the numbers, our [[Punta Cana ROI framework|article|punta-cana-airbnb-roi]] translates directly — model conservative occupancy, budget for management, and confirm CONFOTUR before you buy."],
      ['cta', { label: 'Browse Las Terrenas listings', page: 'search' }],

      ['h', 'The honest trade-offs'],
      ['ol', [
        'It is a small town, not a city. That is the charm — but expect fewer big-box conveniences and a slower pace than Santo Domingo.',
        'High vs. low season is real. Winter buzzes; the shoulder months are quiet, which matters for both lifestyle and rental income.',
        'Beachfront commands a premium. The walk-to-sand premium is significant — decide early whether you are paying for it or buying minutes inland.',
        'Do the same due diligence as anywhere in the DR. Independent attorney, clean title search, deposits in escrow — no exceptions.',
      ]],

      ['h', 'Is Las Terrenas right for you?'],
      ['p', "If you want a walkable, international beach town with real community, great surf and kite conditions, improving infrastructure, and a property market that spans entry-level condos to trophy villas, Las Terrenas is one of the DR's most rewarding places to land. If you need a big-city amenity base or want to optimize purely for rental occupancy, compare it against Santo Domingo and Punta Cana before deciding."],
      ['cta', { label: 'Talk to our bilingual team about Las Terrenas', page: 'contact' }],
    ],
    faqs: [
      { q: 'Is Las Terrenas a good place for expats to live?', a: 'Yes. With around 11,000 expats from more than 20 countries, a walkable town center, multiple languages spoken, good internet, and improving healthcare, Las Terrenas is one of the most established and welcoming expat communities in the Dominican Republic.' },
      { q: 'How do you get to Las Terrenas?', a: 'El Catey International Airport (AZS) is about 20 minutes away with seasonal direct flights to North America and Europe, and a modern toll highway connects the area to Santo Domingo in roughly two hours.' },
      { q: 'How much does real estate cost in Las Terrenas?', a: 'Near-beach condos commonly start around US$200,000, while luxury villas in areas like Playa Bonita and Playa Cosón range from about US$400,000 to over US$1 million. Many newer projects carry CONFOTUR tax incentives.' },
      { q: 'Is Las Terrenas good for rental investment?', a: 'It can be. Strong expat demand supports long-term rentals and a steady tourist flow supports vacation rentals. Yields are typically lifestyle-led rather than the absolute highest in the country, so model conservatively and verify CONFOTUR status.' },
      { q: 'What is the cost of living in Las Terrenas?', a: 'A single remote worker can budget roughly $1,500–$2,200 a month including rent, a couple around $2,200–$3,200, and a family with international schooling $3,500+. Living slightly inland is noticeably cheaper than beachfront.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 3 — Best Places to Retire in the DR
  // ════════════════════════════════════════════════════════════════
  'best-places-to-retire': {
    catKey: 'Lifestyle', catLabel: 'Retirement', read: '13 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Best Places to Retire in the Dominican Republic (2026)',
    lede: 'Warm weather, a low cost of living, and one of the easiest retirement visas in the Caribbean. Here are the best towns to retire in the DR — and exactly how the Pensionado visa works.',
    metaTitle: 'Best Places to Retire in the Dominican Republic (2026 Guide)',
    metaDescription: 'The best places to retire in the Dominican Republic in 2026, plus how the Pensionado and Rentista visas work, cost of living for retirees, and tax benefits under Law 171-07.',
    keywords: ['best places to retire in dominican republic', 'retire in dominican republic', 'dominican republic pensionado visa', 'cost of retiring in dominican republic'],
    facts: [['$1,500 / mo', 'Pensionado income required'], ['Fast-track', 'To permanent residency'], ['$0', 'Foreign-income tax (171-07)'], ['~$1,500+', 'Comfortable monthly budget']],
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "The Dominican Republic has quietly become one of the most popular retirement destinations in the Caribbean — and for good reason. Retirees get year-round warmth, a cost of living a fraction of North America's, a fast-track residency program built for pensioners, and generous tax exemptions on foreign income. The only hard part is choosing where to settle."],
      ['p', "This guide covers the best towns to retire in the DR for different priorities, then walks through the Pensionado and Rentista visas — the routes that make retiring here so straightforward."],

      ['h', 'Why retire in the Dominican Republic?'],
      ['ul', [
        'Cost of living: a comfortable retirement is realistic on roughly $1,500–$2,500 a month for most couples, far below comparable US or Canadian living.',
        'Climate and access: warm weather year-round, with direct flights of under four hours to Miami and New York.',
        'Tax benefits: under Law 171-07, qualifying retiree residents enjoy long-running exemptions on foreign income, plus duty-free importation of household goods and a vehicle.',
        'Healthcare: high-quality, affordable private hospitals in the major hubs, with English-speaking and often US-trained physicians.',
      ]],

      ['h', 'The Pensionado and Rentista visas'],
      ['p', "The DR offers two income-based routes purpose-built for retirees, and both come with a major advantage: they fast-track you straight to permanent residency rather than the standard multi-year wait."],
      ['ul', [
        'Pensionado (pension) visa: requires a pension of at least US$1,500 per month from a government or private source, plus about US$250 per dependent. US Social Security and private pensions both qualify.',
        'Rentista (investment-income) visa: requires roughly US$2,000 per month in passive, investment-derived income. Active salary income does not qualify for either route.',
      ]],
      ['p', "Expect processing of around two to four months with an immigration attorney. Budget for government fees plus legal fees, and have your documents — pension certification, police clearance, and medical certificate — apostilled and translated. Pensionado and Rentista residents can also become eligible for citizenship after just two years of residency."],
      ['tip', "You do not need residency to buy a home — ownership is open to all foreigners. Many retirees buy first, then apply for the Pensionado visa once settled. If residency is part of your plan, [[our bilingual team can map the right route|contact]] for your income situation."],

      ['h', 'The best towns to retire in the DR'],
      ['p', "There is no single \"best\" place — it depends on whether you want beach-town community, big-city amenities, or cooler mountain air. Here is how the top retirement spots compare:"],
      ['table', {
        headers: ['Town', 'Best for', 'Vibe'],
        rows: [
          ['Las Terrenas', 'Walkable beach-town community', 'Bohemian, European-flavored, international'],
          ['Sosúa & Cabarete', 'Affordability + water sports', 'Active, social, established expat scene'],
          ['Puerto Plata', 'Value + historic charm', 'Laid-back north-coast city'],
          ['Punta Cana', 'Amenities + healthcare + airport', 'Resort-style, gated, turnkey'],
          ['Santo Domingo', 'Urban life, top hospitals', 'Cosmopolitan capital'],
          ['Jarabacoa', 'Cooler mountain climate', 'Green, tranquil, outdoorsy'],
        ],
      }],
      ['h3', 'Las Terrenas'],
      ['p', "A bohemian, multilingual beach town on the Samaná Peninsula with a large, welcoming expat community and improving healthcare and access. Ideal for retirees who want a real town rather than a resort bubble — see our full [[Living in Las Terrenas guide|article|las-terrenas]]."],
      ['h3', 'Sosúa, Cabarete & Puerto Plata'],
      ['p', "The north coast offers some of the best value in the country. Cabarete is a magnet for active retirees who love kitesurfing and an outdoorsy social scene; Sosúa has a long-established expat community; and nearby Puerto Plata adds historic charm and city services at affordable prices."],
      ['h3', 'Punta Cana'],
      ['p', "For retirees who prioritize turnkey convenience — gated security, on-site amenities, strong private healthcare, and an international airport minutes away — Punta Cana is hard to beat. Read our [[Living in Punta Cana guide|article|living-punta-cana]] for the neighborhood breakdown."],

      ['h', 'What retirement actually costs'],
      ['p', "Most retired couples live comfortably on roughly $1,500–$2,500 per month, covering housing, food, utilities, transport, and basic healthcare. A two-bedroom rental in many towns runs $400–$800, and fresh food, domestic help, and healthcare are dramatically cheaper than back home. Imported goods and cars are where costs climb, so budgeting toward local products keeps your money going further."],

      ['h', 'Smart steps before you retire here'],
      ['ol', [
        'Visit in both high and low season before committing — towns feel very different in July than in February.',
        'Rent before you buy. Spend a few months in your shortlisted town to confirm the fit before purchasing.',
        'Line up international or local health insurance early; care quality is high but you want coverage in place.',
        'Talk to a cross-border tax advisor so your pension and any rental income are handled correctly in both countries.',
      ]],

      ['h', 'Bottom line'],
      ['p', "Few places make retirement as accessible as the DR: a low cost of living, an income-based visa that fast-tracks permanent residency, real tax advantages, and a town for every temperament — from bohemian Las Terrenas to turnkey Punta Cana. Visit, rent, then buy, and you can build a retirement here that is both affordable and genuinely good."],
      ['cta', { label: 'Explore homes in retirement-friendly towns', page: 'search' }],
    ],
    faqs: [
      { q: 'What is the best place to retire in the Dominican Republic?', a: 'It depends on your priorities: Las Terrenas for a walkable beach-town community, Sosúa/Cabarete and Puerto Plata for affordability and water sports, Punta Cana for amenities and healthcare, Santo Domingo for city life, and Jarabacoa for cooler mountain air.' },
      { q: 'How much money do I need to retire in the DR?', a: 'Most retired couples live comfortably on roughly $1,500–$2,500 per month including housing, food, utilities, transport, and basic healthcare. The Pensionado visa separately requires at least US$1,500 per month in pension income.' },
      { q: 'What are the requirements for the Pensionado visa?', a: 'A pension of at least US$1,500 per month (plus about US$250 per dependent) from a government or private source. US Social Security qualifies. The Rentista alternative requires about US$2,000 per month in passive investment income.' },
      { q: 'Do I need residency to buy a retirement home in the DR?', a: 'No. Foreigners can buy property with full ownership rights regardless of residency. Many retirees buy first and apply for the Pensionado visa afterward.' },
      { q: 'Are there tax benefits for retirees?', a: 'Yes. Under Law 171-07, qualifying retiree residents receive long-running exemptions on foreign-sourced income and duty-free importation of household goods and a vehicle, among other benefits.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 3 — Is DR Real Estate Safe? Scams to Avoid
  // ════════════════════════════════════════════════════════════════
  'dr-real-estate-safe': {
    catKey: 'Buying', catLabel: 'Safety & Trust', read: '12 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Is Dominican Republic Real Estate Safe? Scams to Avoid (2026)',
    lede: 'Yes — buying in the DR is safe when you do it right. The real risks are never about crime; they are about paperwork. Here are the scams that catch foreign buyers and exactly how to avoid them.',
    metaTitle: 'Is Dominican Republic Real Estate Safe? Scams & How to Avoid Them',
    metaDescription: 'Is buying property in the Dominican Republic safe? Yes — with the right process. Learn the top real estate scams foreign buyers face and the due-diligence steps that protect you.',
    keywords: ['is dominican republic real estate safe', 'dominican republic real estate scams', 'dominican republic property fraud', 'buying property dominican republic safely'],
    facts: [['Protected', 'Foreign ownership rights'], ['Registro', 'Verify owner via certification'], ['Escrow', 'Never pay the seller direct'], ['Unregulated', 'DR agents need no license']],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Yes — buying real estate in the Dominican Republic is safe, and foreign ownership is legally protected with the same rights as Dominican citizens. But \"safe\" comes with a condition: you have to run the process correctly. The buyers who get burned here almost never lose money to crime. They lose it to paperwork — a title that was not what it seemed, a deposit paid too early, or a lien nobody checked for."],
      ['p', "Here is an honest look at the risks, the specific scams that target foreign buyers, and the due-diligence steps that make a Dominican purchase genuinely secure."],

      ['h', 'The real risk is the paperwork, not the place'],
      ['p', "The single most important difference from a US or Canadian purchase: the DR does not use title-insurance companies, and there is no automatic escrow agent assigned to your deal. The verification that a title insurer would do back home is instead done by your attorney. That makes your choice of an independent, licensed attorney the most important decision in the entire transaction."],
      ['tip', "There are no licensing requirements for real estate agents in the DR — effectively anyone can call themselves an agent. That is exactly why working with verified listings and a vetted attorney network matters so much: it puts the checks back into a market that does not require them by law."],

      ['h', 'The top scams foreign buyers face'],
      ['p', "Most fraud against foreign buyers falls into a few recognizable patterns:"],
      ['ul', [
        'Reservation-deposit traps: you are pressured to pay a deposit to "hold" a unit before anyone has verified it is real, unencumbered, and actually owned by the seller. Once the money is gone, so is the leverage.',
        'Title or ownership misrepresentation: the person selling is not the true registered owner, or cannot legally transfer clean title. This is where forged or outdated title certificates show up.',
        'Hidden encumbrances: liens, an existing mortgage, unpaid property taxes, or boundary disputes that only surface after you have paid.',
        'Boundary and survey gaps: buying land or a lot without a registered survey (deslinde), then discovering it is smaller — or located differently — than advertised.',
      ]],
      ['p', "The common thread is timing: in every case, money moved before verification finished. Reverse that order and most of the risk disappears."],

      ['h', 'How to protect yourself — the non-negotiables'],
      ['ol', [
        'Hire your own independent, licensed Dominican real estate attorney — never rely on the seller’s or developer’s lawyer.',
        'Verify the title at the source. Your attorney should pull a fresh Certificación del Estado Jurídico del Inmueble directly from the Registro Inmobiliario, which shows the current registered owner and confirms the legal right to sell. Never trust any document the seller simply hands you.',
        'Confirm the deslinde (registered boundary survey) so the land is properly individualized and its limits are legally defined.',
        'Use escrow. Deposit funds with a neutral third party, released only as verified milestones are met — not directly to the seller.',
        'Keep deposits out of play until the title search is clean. A clean Certificación comes first; money follows.',
        'For off-plan, vet the developer’s title, permits, and delivery track record before paying anything.',
      ]],

      ['h', 'Red flags to walk away from'],
      ['ul', [
        'Pressure to pay a deposit quickly "before someone else takes it."',
        'A seller or agent who resists you bringing your own attorney.',
        'Title documents provided only as copies, or that cannot be confirmed at the registry.',
        'A price well below market with a vague explanation — too-good-to-be-true usually is.',
        'Reluctance to use escrow or to put agreed terms into a written, bilingual Promise of Sale.',
      ]],

      ['h', 'How we reduce the risk'],
      ['p', "Because the DR market puts verification on the buyer, we built the checks in: listings are admin-verified, and we work with a vetted bilingual attorney network that handles title searches, the Promise of Sale, escrow, and closing. It is the same protection a seasoned local buyer relies on — made available to first-time foreign buyers. For the full transaction walkthrough, see [[Can Americans buy property in the DR|article|can-americans-buy]] and our [[closing costs guide|article|closing-costs-dr]]."],

      ['h', 'Bottom line'],
      ['p', "Dominican real estate is safe for foreign buyers who respect the process: independent attorney, fresh title verification at the registry, a confirmed survey, and escrow before any money moves. Do those four things and the headline risks simply do not apply to you. Skip them, and no market in the world is safe."],
      ['cta', { label: 'Browse admin-verified listings', page: 'search' }],
    ],
    faqs: [
      { q: 'Is it safe to buy property in the Dominican Republic as a foreigner?', a: 'Yes. Foreign ownership is legally protected with the same rights as citizens, and the purchase is secure when done correctly. The real risks are title and process related, not crime, and they are preventable with proper due diligence.' },
      { q: 'What are the most common real estate scams in the DR?', a: 'The most common are reservation-deposit traps (paying before verification), title or ownership misrepresentation (including forged or outdated title certificates), and hidden encumbrances such as liens, mortgages, or unpaid taxes that surface after payment.' },
      { q: 'How do I verify a property title in the DR?', a: 'Have your attorney obtain a fresh Certificación del Estado Jurídico del Inmueble directly from the Registro Inmobiliario. It confirms the current registered owner and their legal right to sell. Never rely on documents the seller simply provides.' },
      { q: 'Should I use an escrow service?', a: 'Yes. Depositing funds with a neutral third party that releases them only as verified milestones are met is one of the most effective protections against fraud. Avoid paying the seller directly.' },
      { q: 'Are real estate agents regulated in the Dominican Republic?', a: 'No. The DR has no licensing requirement for agents, so anyone can act as one. This makes working with verified listings and an independent, licensed attorney especially important.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 3 — Living in Punta Cana (neighborhood guide)
  // ════════════════════════════════════════════════════════════════
  'living-punta-cana': {
    catKey: 'Moving', catLabel: 'Neighborhood Guide', read: '13 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Living in Punta Cana: The Complete Expat Guide (2026)',
    lede: "The DR's resort capital is also its most turnkey place to live — gated communities, an international airport on your doorstep, and the country's strongest expat infrastructure. Here is the full picture.",
    metaTitle: 'Living in Punta Cana, Dominican Republic — 2026 Expat Guide',
    metaDescription: 'A complete 2026 guide to living in Punta Cana: the best expat neighborhoods, cost of living, safety, healthcare, getting around, and the real estate and investment market.',
    keywords: ['living in punta cana', 'punta cana expat guide', 'best neighborhoods punta cana', 'moving to punta cana dominican republic'],
    facts: [['~$2,400 / mo', 'Comfortable single budget'], ['Cap Cana', 'Top luxury enclave'], ['PUJ', 'International airport on-site'], ['Year-round', 'Tourist demand']],
    img: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Punta Cana is the Dominican Republic's tourism capital, and that shapes everything about living there. It has the country's deepest expat infrastructure — gated communities, international schools and hospitals, English-speaking services, imported groceries — plus an international airport (PUJ) minutes away. If Las Terrenas is the bohemian beach town, Punta Cana is the turnkey, amenity-rich option."],

      ['h', 'Who Punta Cana is for'],
      ['p', "It tends to suit two groups: investors who want strong, year-round short-term-rental demand, and lifestyle buyers — including retirees and families — who value convenience, security, and amenities over a small-town feel. If you want everything handled, an airport on your doorstep, and a deep community of fellow expats, Punta Cana delivers. If you want a quiet, walkable village, you may prefer the north coast or Samaná."],

      ['h', 'The best expat neighborhoods'],
      ['p', "\"Punta Cana\" is really a cluster of distinct communities, mostly within the broader Bávaro–Punta Cana area:"],
      ['ul', [
        'Cap Cana — the luxury top tier: gated, with a marina, golf, and high-end villas; pricing closer to South Florida than to the rest of the DR.',
        'Puntacana Village — a walkable, established residential hub near the airport with shops, restaurants, and a popular expat-family base.',
        'Cocotal — a gated golf community known for security and a quiet residential feel.',
        'Los Corales & El Cortecito — dense, beachfront-adjacent areas with a strong concentration of restaurants and established short- and medium-term rentals.',
        'White Sands & Arena Gorda — managed residential and resort-adjacent areas with controlled access.',
        'Uvero Alto — north of the main strip: quieter, lower-density, and up-and-coming, but you will want a car.',
      ]],

      ['h', 'Cost of living'],
      ['p', "Punta Cana is more expensive than most of the DR because so much is geared to tourists and expats, but still well below North American costs. Rough monthly guidance for 2026:"],
      ['table', {
        headers: ['Profile', 'Typical monthly budget', 'Notes'],
        rows: [
          ['Single, modest', '~$1,600 – $2,100', 'Local-leaning lifestyle'],
          ['Single, comfortable', '~$2,400', 'Decent apartment, dining out, leisure'],
          ['Couple / retirees', '~$2,500 – $3,500', 'Gated community, car, dining'],
          ['1-bed rent (Bávaro / PC Village)', '~$1,000 – $1,400', 'Higher in Cap Cana'],
        ],
      }],
      ['p', "Living inside premium gated communities like Cap Cana pushes costs up; local-leaning neighborhoods bring them down."],

      ['h', 'Getting around, healthcare and amenities'],
      ['p', "Punta Cana International Airport (PUJ) is the second-busiest in the country, with direct flights across North America and Europe — a major draw for both lifestyle owners and rental investors. The area has private hospitals and clinics with English-speaking staff, international supermarkets, and a wide dining scene. A car is useful, as the communities are spread out and public transport is limited."],

      ['h', 'Safety'],
      ['p', "The expat-favored neighborhoods — Cap Cana, Puntacana Village, Cocotal, White Sands and Arena Gorda — are gated or managed communities with private security and controlled access, which is a big part of why families and retirees feel comfortable there. As anywhere, normal precautions apply, but the managed-community model is the norm for expat living here."],

      ['h', 'Real estate and investment'],
      ['p', "Punta Cana has the country's strongest short-term-rental economics, driven by relentless tourist demand and beachfront premiums. Many developments carry CONFOTUR tax incentives that can waive the transfer tax and property tax for up to 15 years. If you are buying to rent, run the numbers carefully — our [[Punta Cana Airbnb ROI guide|article|punta-cana-airbnb-roi]] breaks down realistic occupancy, rates and yields, and the [[closing costs guide|article|closing-costs-dr]] covers your all-in purchase costs."],
      ['cta', { label: 'Browse Punta Cana listings', page: 'search' }],

      ['h', 'The honest trade-offs'],
      ['ol', [
        'It can feel resort-like rather than authentically local — that is the appeal for some and the drawback for others.',
        'You will likely need a car; communities are spread out and walkability varies a lot by neighborhood.',
        'Premium gated living (Cap Cana) carries premium prices closer to US levels.',
        'High season is busy and pricey; consider how seasonality affects both lifestyle and rental income.',
      ]],

      ['h', 'Is Punta Cana right for you?'],
      ['p', "If you want the DR's most convenient, amenity-rich, and investment-friendly base — with an international airport, strong healthcare, gated security, and a large expat community — Punta Cana is the obvious choice. If you are after small-town character and walkability, compare it with [[Las Terrenas|article|las-terrenas]] before deciding."],
      ['cta', { label: 'Talk to our bilingual team about Punta Cana', page: 'contact' }],
    ],
    faqs: [
      { q: 'Is Punta Cana a good place to live as an expat?', a: 'Yes. Punta Cana has the deepest expat infrastructure in the DR — gated communities, international schools and hospitals, English-speaking services, and an international airport — making it one of the most convenient and turnkey places to live in the country.' },
      { q: 'What are the best neighborhoods in Punta Cana for expats?', a: 'Popular expat areas include Cap Cana (luxury), Puntacana Village (walkable and family-friendly), Cocotal (gated golf), Los Corales and El Cortecito (beachfront-adjacent), White Sands and Arena Gorda (managed), and the up-and-coming Uvero Alto.' },
      { q: 'How much does it cost to live in Punta Cana?', a: 'A single person lives comfortably on roughly US$2,400 per month, with a more modest lifestyle around $1,600–$2,100 and couples or retirees around $2,500–$3,500. Premium gated communities like Cap Cana cost more.' },
      { q: 'Is Punta Cana safe?', a: 'The expat-favored neighborhoods are gated or managed communities with private security and controlled access, which is why families and retirees feel comfortable there. Normal precautions apply, but the managed-community model is standard for expat living.' },
      { q: 'Is Punta Cana good for real estate investment?', a: 'Yes. It has the strongest short-term-rental demand in the country, year-round tourism, and many CONFOTUR-eligible developments that can waive transfer and property taxes for up to 15 years. Model occupancy and costs carefully before buying.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 4 — CONFOTUR Explained
  // ════════════════════════════════════════════════════════════════
  'confotur-explained': {
    catKey: 'Legal', catLabel: 'Tax Incentive', read: '11 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'CONFOTUR Explained: 15 Years of Tax-Free Property in the DR (2026)',
    lede: 'The single biggest tax break in Dominican real estate. Here is what CONFOTUR actually waives, how much it saves you, who qualifies, and how to verify a project really has it.',
    metaTitle: 'CONFOTUR Law Explained (2026) — 15 Years Tax-Free DR Property',
    metaDescription: "A clear 2026 guide to the Dominican Republic's CONFOTUR law (158-01): the transfer-tax and 15-year property-tax exemptions, who qualifies, a savings example, and how to verify a project.",
    keywords: ['confotur', 'confotur law dominican republic', 'confotur tax exemption', 'dominican republic tax free property'],
    facts: [['Law 158-01', 'CONFOTUR (since 2001)'], ['0%', 'Transfer tax (waived)'], ['Up to 15 yrs', 'Property-tax exemption'], ['Foreigners', 'Qualify equally']],
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "If you only learn one Dominican real estate term before buying, make it CONFOTUR. It is the country's flagship tourism-investment incentive, and for a buyer it can erase the bulk of your closing costs and your property taxes for up to 15 years. Two near-identical condos can have wildly different true costs based on this single factor — so it is worth understanding properly."],

      ['h', 'What is CONFOTUR?'],
      ['p', "CONFOTUR (from the Spanish for the Council for the Development of Tourism) is established under Law 158-01, enacted in 2001 to promote tourism development and foreign investment. The government grants approved tourism-related projects a package of tax exemptions, and crucially, those benefits pass through to the buyers of units in the project — not just the developer."],

      ['h', 'What CONFOTUR waives for a buyer'],
      ['ul', [
        'The 3% transfer tax: normally paid at closing to register your title — waived entirely on a CONFOTUR-approved property.',
        'The annual IPI property tax: the standard 1% on value above the threshold is exempt for up to 15 years.',
        'Rental income tax: income from an approved tourism project may be exempt from income tax (ISR) for a period as well, depending on the project and conditions.',
      ]],
      ['p', "For an investor or a snowbird renting seasonally, that combination lowers both the cost of getting in and the cost of holding — directly improving net yield. It is also why CONFOTUR status belongs on your due-diligence checklist, alongside the title search."],

      ['h', 'How much does it actually save you?'],
      ['p', "Take a US$300,000 condo. On a standard purchase you would pay the 3% transfer tax up front, then annual IPI on the value above the exemption threshold. Under CONFOTUR, both can disappear:"],
      ['table', {
        headers: ['Cost', 'Standard purchase', 'CONFOTUR-approved'],
        rows: [
          ['Transfer tax (3%)', '$9,000', '$0'],
          ['Annual IPI (≈1% above threshold)', '~$1,180 / year', '$0 (up to 15 yrs)'],
          ['IPI over 15 years', '~$17,700', '$0'],
          ['Indicative total saved', '—', '≈ $26,700+'],
        ],
      }],
      ['p', "Figures are illustrative and depend on the appraised value and exchange rate, but the scale is real: the savings on a single mid-range condo can run well into five figures over the exemption window. See our [[closing costs guide|article|closing-costs-dr]] and [[property tax explainer|article|property-taxes-ipi]] for the standard (non-exempt) numbers."],

      ['h', 'Who qualifies?'],
      ['ul', [
        'Both Dominican citizens and foreign buyers qualify equally — there is no residency requirement to receive the benefits.',
        'The property must be part of an officially CONFOTUR-approved project. The exemption attaches to the approved development, not to you personally.',
        'Buying a raw, empty lot on your own in a tourism zone does not come with CONFOTUR benefits. However, a land-and-build package within a developer\'s approved master plan can qualify once built.',
      ]],
      ['tip', "Because the benefit lives with the project, the question to ask is never \"do I qualify?\" but \"is this specific development CONFOTUR-approved?\" Ask the developer for the official CONFOTUR resolution, and have your attorney confirm it independently — do not take a brochure's word for it."],

      ['h', 'How to verify a project really has CONFOTUR'],
      ['ol', [
        'Request the official CONFOTUR approval resolution (with its number and date) from the developer.',
        'Have your independent attorney confirm the approval is genuine, current, and covers the specific unit you are buying.',
        'Confirm what is included and for how long — the property-tax exemption window and any rental-income exemption can vary by project.',
        'Get the exemption reflected in writing in your Promise of Sale, so it is part of the deal you actually sign.',
      ]],

      ['h', 'The caveats'],
      ['p', "CONFOTUR is genuinely valuable, but it is not automatic and not unconditional. The income-tax exemption in particular depends on the project and how the property is used, and exemptions have defined time windows. Treat the headline \"15 years tax-free\" as the ceiling to verify, not a guarantee to assume — your attorney's confirmation is what turns it into a real number you can bank on."],

      ['h', 'Bottom line'],
      ['p', "CONFOTUR can be the difference between an average deal and an excellent one: no transfer tax at purchase and up to 15 years free of property tax, available to foreign buyers with no residency required. The catch is verification — confirm the project's approval through your own attorney, get it in writing, and the savings are yours. If you are weighing investment returns, our [[Punta Cana ROI guide|article|punta-cana-airbnb-roi]] shows how the exemption flows through to yield."],
      ['cta', { label: 'Estimate your savings in the ROI calculator', page: 'calculator' }],
    ],
    faqs: [
      { q: 'What is the CONFOTUR law?', a: 'CONFOTUR is the Dominican Republic\'s tourism-investment incentive, established under Law 158-01 (2001). It grants approved tourism projects tax exemptions that pass through to buyers, including a waived 3% transfer tax and up to 15 years free of the annual property tax.' },
      { q: 'How much can CONFOTUR save me?', a: 'On a US$300,000 condo, you could save roughly $9,000 in transfer tax plus around $1,000+ per year in property tax for up to 15 years — often well over $25,000 in total. Exact savings depend on appraised value and the exemption terms.' },
      { q: 'Do foreigners qualify for CONFOTUR?', a: 'Yes. Foreign buyers qualify equally with Dominican citizens, and no residency is required. The key requirement is that the property is part of an officially CONFOTUR-approved development.' },
      { q: 'Does buying land qualify for CONFOTUR?', a: 'Not on its own. Buying a raw, empty lot does not come with CONFOTUR benefits. A land-and-build package within a developer\'s approved master plan can qualify once the property is built.' },
      { q: 'How do I confirm a project has CONFOTUR?', a: 'Ask the developer for the official CONFOTUR approval resolution and have your independent attorney verify it is genuine, current, and covers your specific unit — then get it written into your Promise of Sale.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 4 — DR vs Miami: The Investor Case
  // ════════════════════════════════════════════════════════════════
  'dr-vs-miami': {
    catKey: 'Investing', catLabel: 'Investment Intelligence', read: '12 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Dominican Republic vs Miami: The 2026 Investor Case',
    lede: 'Same Caribbean sun, very different math. A head-to-head on entry price, yields, taxes, and risk — and an honest take on which market fits which investor.',
    metaTitle: 'Dominican Republic vs Miami Real Estate — 2026 Investor Comparison',
    metaDescription: 'A head-to-head 2026 comparison of Dominican Republic vs Miami real estate investment: entry prices, price per square foot, rental yields, property taxes, and risk.',
    keywords: ['dominican republic vs miami real estate', 'dominican republic real estate investment', 'invest dominican republic or miami', 'caribbean real estate investment 2026'],
    facts: [['~$205/sqft', 'DR avg (apartments)'], ['$400–1,000+', 'Miami /sqft'], ['~7–8%', 'DR gross yields'], ['~2.45%', 'Miami annual property tax']],
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "Investors who like warm-weather real estate keep landing on the same question: Miami or the Dominican Republic? Both offer sun, tourism, and dollar-denominated returns. But the numbers behind them are very different — the DR competes on entry price, yield, and taxes, while Miami competes on liquidity, scale, and the comfort of the US legal system. Here is the head-to-head."],

      ['h', 'Entry price: the biggest gap'],
      ['p', "This is where the markets separate most sharply. In the DR, investable condos in prime tourism zones start far lower than a Miami down payment: Punta Cana condos can begin under US$150,000 and north-coast villas in the Sosúa area from roughly US$150,000, while modest Miami returns typically require US$500,000 or more. Lower entry price also means more diversification — two or three DR units for the price of one Miami condo."],

      ['h', 'The numbers, side by side'],
      ['table', {
        headers: ['Factor', 'Dominican Republic', 'Miami'],
        rows: [
          ['Typical entry price', 'From ~$99k–150k', '~$500k+'],
          ['Price per sq ft (avg)', '~$200–210', '~$400–700+ ($1,000+ luxury)'],
          ['Gross rental yield', '~7–8% (PC condos 6–12%)', '~6–7%'],
          ['Net rental yield', 'Often ~7% in tourism zones', 'Typically ~4–5%'],
          ['Annual property tax', '1% above ~$182k (or $0 CONFOTUR)', '~2.45% of assessed value'],
          ['Tax incentives', 'CONFOTUR: up to 15 yrs tax-free', 'Limited homestead-type exemptions'],
        ],
      }],
      ['p', "Treat every figure as an input to verify, not a promise — yields in particular swing with location, management, and seasonality. But the structural pattern is consistent: the DR offers a lower basis and a lighter tax load, while Miami offers a deeper, more liquid market."],

      ['h', 'Yields and taxes: where the DR pulls ahead'],
      ['p', "Miami yields have compressed as prices climbed — well-run rentals often net around 4–5%, with optimized properties reaching toward 6%. In DR tourism corridors, a disciplined underwrite can model net yields near 7%, with top operators higher. Then layer on tax: Miami carries an annual property tax around 2.45% of assessed value — on a $485,000 home that is roughly $10,000 a year, every year. A comparable DR property can owe 1% only on value above the exemption threshold, or nothing at all for up to 15 years under [[CONFOTUR|article|confotur-explained]]. Over a holding period, that tax gap compounds meaningfully."],

      ['h', 'Where Miami wins'],
      ['p', "An honest comparison has to credit Miami's advantages, because they are real:"],
      ['ul', [
        'Liquidity and depth: a far larger, more liquid market with established financing — easier to buy, sell, and leverage.',
        'Legal familiarity: the US system, title insurance, and standardized escrow that DR buyers must replicate through an attorney.',
        'Mortgage access: financing is routine for US buyers, whereas most DR foreign buyers pay cash.',
        'Currency and distance: for a US investor, no currency conversion and a property in your home jurisdiction.',
      ]],

      ['h', 'Where the DR wins'],
      ['ul', [
        'Lower entry price and the diversification that buys.',
        'Higher net yields in tourism corridors with strong short-term-rental demand.',
        'Dramatically lower property taxes — potentially zero for up to 15 years via CONFOTUR.',
        'Strong appreciation in growth markets, plus tax exemptions on foreign income for resident investors under Law 171-07.',
      ]],

      ['h', 'The honest trade-off'],
      ['p', "Miami is the safer, more liquid, lower-friction market — and you pay for that in price and yield. The DR offers a lower basis, lighter taxes, and higher income returns — in exchange for less liquidity and the need to run a proper, attorney-led process the US system would otherwise handle for you. The DR's risks are manageable, but they are yours to manage; see our guide on [[buying safely and avoiding scams|article|dr-real-estate-safe]]."],

      ['h', 'Which should you choose?'],
      ['p', "If you want maximum liquidity, easy financing, and to stay inside the US system, Miami is the comfortable choice. If you want a lower entry point, higher net yields, and a far lighter tax burden — and you are willing to do disciplined due diligence — the DR makes a compelling case, especially with a CONFOTUR-approved property. Many investors ultimately do both: a liquid US holding and a higher-yield DR asset. Model your specific deal before deciding."],
      ['cta', { label: 'Model a DR deal in the ROI calculator', page: 'calculator' }],
    ],
    faqs: [
      { q: 'Is the Dominican Republic a better investment than Miami?', a: 'It depends on your goals. The DR offers lower entry prices, higher net rental yields in tourism zones, and far lower property taxes (potentially zero under CONFOTUR). Miami offers more liquidity, easier financing, and the familiarity of the US legal system.' },
      { q: 'How do rental yields compare?', a: 'DR tourism-corridor properties can model net yields near 7%, with Punta Cana condos quoting 6–12% gross. Miami rentals often net around 4–5% after expenses, with optimized properties approaching 6%.' },
      { q: 'How much cheaper is DR property than Miami?', a: 'Substantially. DR averages roughly $200–210 per square foot versus $400–700+ in Miami (and $1,000+ for luxury). Investable DR condos can start under $150,000, while modest Miami returns typically require $500,000 or more.' },
      { q: 'What about property taxes?', a: 'Miami property tax runs around 2.45% of assessed value annually — about $10,000 a year on a $485,000 home. DR property tax is 1% only on value above roughly $182,000, and CONFOTUR-approved properties can be exempt for up to 15 years.' },
      { q: 'What is the catch with the DR?', a: 'Less liquidity, mostly cash purchases, and the need to run an attorney-led process that replaces US-style title insurance and escrow. These risks are manageable with proper due diligence, but they are the investor\'s responsibility.' },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // WEEK 4 — Living in Cabarete & Sosúa (neighborhood guide)
  // ════════════════════════════════════════════════════════════════
  'living-cabarete-sosua': {
    catKey: 'Moving', catLabel: 'Neighborhood Guide', read: '12 min', reads: '—', date: '2026',
    author: 'iLoveDRRealty Team', role: 'Dominican Republic real estate experts', initials: 'DR',
    title: 'Living in Cabarete & Sosúa: North Coast Expat Guide (2026)',
    lede: "The DR's north coast pairs the kitesurf capital of the Caribbean with one of its best-value expat towns. Here is who each suits, what life costs, and what real estate runs.",
    metaTitle: 'Living in Cabarete & Sosúa — North Coast DR Expat Guide (2026)',
    metaDescription: 'A 2026 guide to living in Cabarete and Sosúa on the DR north coast: expat community, cost of living, kitesurfing, getting there, and the real estate and investment market.',
    keywords: ['living in cabarete', 'living in sosua', 'cabarete sosua expat', 'north coast dominican republic real estate'],
    facts: [['$1,800–2,800', 'Comfortable monthly'], ['Kitesurf', 'Cabarete world capital'], ['POP ~30 min', 'Puerto Plata airport'], ['From ~$150k', 'Condos']],
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['p', "The Dominican Republic's north coast is the active, affordable counterpoint to the resort south. Centered on the twin towns of Cabarete and Sosúa, it has drawn an established international community for decades — pulled in by world-class water sports, a relaxed beach-town pace, and some of the best property value in the country. The two towns sit minutes apart but have distinct personalities."],

      ['h', 'Cabarete: the kitesurf capital'],
      ['p', "Cabarete is the kitesurfing and windsurfing capital of the Caribbean, with steady trade winds that draw riders year-round and host the famous Master of the Ocean competition each February. Nearby Playa Encuentro is a renowned surf break. The town skews younger, sportier, and more international — think beachfront cafés, yoga, and an outdoorsy, digital-nomad-friendly energy. It suits active expats and remote workers who want the ocean as their gym."],

      ['h', 'Sosúa: established value'],
      ['p', "A few minutes west, Sosúa is the more settled of the pair — a long-standing expat town with a pretty bay beach, a walkable center, and a strong base of services. It tends to attract retirees and families drawn by affordability, established healthcare and shopping, and an easier pace than Cabarete. Of the two, Sosúa generally offers the better entry-level value."],
      ['tip', "Don't choose between them in the abstract — they are a 10-minute drive apart. Many expats live in one and play in the other. Base yourself near the lifestyle you want day-to-day (surf and social: Cabarete; settled and value: Sosúa) and treat the whole corridor as your home base."],

      ['h', 'Getting there and infrastructure'],
      ['p', "The north coast is served by Gregorio Luperón International Airport (POP) in Puerto Plata, roughly 20–40 minutes from the towns, with direct flights to North America and Europe. Santiago's airport (STI) is about 90 minutes inland as an alternative. The corridor has supermarkets, international restaurants, banks, reliable internet, private clinics and hospitals, and several international schools — a mature expat infrastructure built over decades."],

      ['h', 'Cost of living'],
      ['p', "The north coast is among the better-value expat regions in the DR. Rough monthly guidance for 2026:"],
      ['table', {
        headers: ['Profile', 'Typical monthly budget', 'Notes'],
        rows: [
          ['Single / remote worker', '~$1,500 – $2,000', 'Local-leaning lifestyle'],
          ['Couple / retirees', '~$1,800 – $2,800', 'Comfortable, with a car and dining out'],
          ['2-bed gated condo (rent)', '~$800 – $1,800', 'Higher for beachfront or premium communities'],
        ],
      }],

      ['h', 'The real estate market'],
      ['p', "Value is the north coast's calling card. Condos commonly run from around US$150,000 to US$450,000, while villas range from roughly US$350,000 to US$1.2 million and up. Established gated communities — names like Sea Horse Ranch and Casa Linda — anchor the higher end with security and amenities. Many newer developments carry CONFOTUR status, waiving transfer and property taxes for up to 15 years; see our [[CONFOTUR guide|article|confotur-explained]] for how that works."],
      ['p', "On the investment side, the area's mix of long-term expat demand and seasonal tourism supports both rental models, with gated communities reportedly seeing solid appreciation. As always, treat agency yield claims as a starting point and underwrite conservatively — our [[Punta Cana ROI framework|article|punta-cana-airbnb-roi]] applies directly to north-coast deals too."],
      ['cta', { label: 'Browse north-coast listings', page: 'search' }],

      ['h', 'The honest trade-offs'],
      ['ol', [
        'It is lower-key than Punta Cana — fewer luxury-resort trappings, which is exactly the appeal for many.',
        "Cabarete's town center can be busy and noisy in season; quieter living is a short drive out.",
        'You will likely want a car to move between the towns and beaches comfortably.',
        'Do the same due diligence as anywhere in the DR — independent attorney, clean title, escrow. See [[buying safely|article|dr-real-estate-safe]].',
      ]],

      ['h', 'Is the north coast right for you?'],
      ['p', "If you want water sports, a genuine long-standing expat community, and the best value-for-money in the country, Cabarete and Sosúa are hard to beat. If you prioritize luxury-resort polish or the absolute deepest amenity base, compare the corridor against [[Punta Cana|article|living-punta-cana]] and bohemian [[Las Terrenas|article|las-terrenas]] before deciding."],
      ['cta', { label: 'Talk to our bilingual team about the north coast', page: 'contact' }],
    ],
    faqs: [
      { q: 'Is Cabarete or Sosúa better for expats?', a: 'They suit different people and are only minutes apart. Cabarete is younger, sportier, and built around kitesurfing and surf; Sosúa is more settled, family- and retiree-friendly, and generally better value. Many expats live near one and enjoy both.' },
      { q: 'How much does it cost to live on the DR north coast?', a: 'A comfortable monthly budget is roughly $1,800–$2,800 for a couple, with singles often $1,500–$2,000. A 2-bed condo in a gated community typically rents for $800–$1,800 depending on location.' },
      { q: 'How do you get to Cabarete and Sosúa?', a: 'Gregorio Luperón International Airport (POP) in Puerto Plata is about 20–40 minutes away with direct flights to North America and Europe. Santiago (STI) is about 90 minutes inland as an alternative.' },
      { q: 'How much does real estate cost in Cabarete and Sosúa?', a: 'Condos commonly run from about US$150,000 to US$450,000 and villas from roughly US$350,000 to over US$1.2 million. Established gated communities anchor the higher end, and many projects carry CONFOTUR tax incentives.' },
      { q: 'Is the north coast good for kitesurfing?', a: 'Yes — Cabarete is considered the kitesurfing and windsurfing capital of the Caribbean, with reliable trade winds year-round and the annual Master of the Ocean competition each February.' },
    ],
  },
}
