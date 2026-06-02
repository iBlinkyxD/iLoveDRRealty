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

export const FEATURED = {
  slug: 'moving-guide',
  tag: 'MOVING GUIDE · 2026',
  title: 'The complete guide to moving to the Dominican Republic',
  desc: 'Everything from visa pathways and residency to opening a bank account, finding your first home, and joining the expat community. Updated for 2026, used by 12,000+ families.',
  author: 'Maria Cruz',
  role: 'Relocation Editor',
  read: '18 min read',
  initials: 'MC',
  img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop',
}

export const EDITOR_PICKS = [
  {
    slug: 'investors-miami',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80&auto=format&fit=crop',
    cat: 'Investing', icon: '📈',
    title: 'Why investors are choosing the DR over Miami',
    desc: "ROI comparisons, tax advantages, and why the Caribbean's fastest-growing market is capturing global attention.",
    author: 'Carlos Reyes', read: '12 min',
  },
  {
    slug: 'regions-compare',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80&auto=format&fit=crop',
    cat: 'Buying', icon: '🏠',
    title: 'Punta Cana vs Las Terrenas vs Santo Domingo',
    desc: "A detailed comparison of the DR's top markets for buyers and investors in 2026.",
    author: 'Ana Peña', read: '9 min',
  },
]

export const GUIDES = [
  { slug: 'residency-2026', cat: 'Legal',     icon: '🛂', title: 'How to get Dominican residency in 2026',       desc: 'Step-by-step breakdown of the residency process, documents, timelines, and costs.',                                       read: '8 min',  img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80&auto=format&fit=crop' },
  { slug: 'property-law',   cat: 'Legal',     icon: '⚖️', title: 'Understanding Dominican property law',         desc: 'Title certificates, Título de Propiedad, due diligence, and protecting your investment.',                                   read: '14 min', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80&auto=format&fit=crop' },
  { slug: 'tax-171-07',     cat: 'Investing', icon: '💰', title: 'Tax benefits: Law 171-07 explained',           desc: "How the DR's special residency exempts you from income, capital gains, and import taxes for 20 years.",                  read: '10 min', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80&auto=format&fit=crop' },
  { slug: 'cost-of-living', cat: 'Lifestyle', icon: '🛒', title: 'Real cost of living in the DR',                desc: 'Groceries, utilities, dining, healthcare, and private schooling — honest numbers from real expats.',                      read: '7 min',  img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80&auto=format&fit=crop' },
  { slug: 'schools',        cat: 'Lifestyle', icon: '🎓', title: 'Best international schools for expat families', desc: 'IB programmes, American curricula, tuition ranges, and the best neighborhoods for families.',                           read: '11 min', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80&auto=format&fit=crop' },
  { slug: 'healthcare',     cat: 'Lifestyle', icon: '🏥', title: 'Healthcare in the DR',                         desc: 'Top hospitals, international insurance, and why medical tourism is booming in Punta Cana.',                                read: '9 min',  img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80&auto=format&fit=crop' },
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
  ["Can I rent out my property when I'm not using it?", "Yes. Short- and long-term rentals are common, and I♥DR Realty's booking tools let owners manage availability and payments directly."],
]

export const FAQ_COLORS = [c.coral, c.sea, c.green, c.gold, '#7c3aed', c.coral]

export type ArticleBody = ['h' | 'p', string]

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
  body: ArticleBody[]
  img: string
}

export const ARTICLES: Record<string, Article> = {
  'moving-guide': {
    catKey: 'Moving', catLabel: 'Moving Guide', read: '18 min', reads: '12,000+', date: '2026',
    author: 'Maria Cruz', role: 'Relocation Lead, ILoveDR', initials: 'MC',
    title: 'The Complete Guide to Moving to the Dominican Republic',
    lede: 'Everything from visa requirements and residency pathways to finding your first home, opening a bank account, and joining the expat community.',
    facts: [['400K+', 'Expats living in the DR'], ['$0', 'Income tax for 20 years (Law 171-07)'], ['$1,400', 'Average monthly living cost'], ['30–60 days', 'Typical residency timeline']],
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'Why people move to the DR'],
      ['p', "The Dominican Republic has quietly become one of the Caribbean's most popular destinations for expats, retirees, and remote workers. A combination of warm year-round weather, a low cost of living, generous tax incentives, and a fast-growing economy makes it an appealing base for people from North America, Europe, and across Latin America."],
      ['p', 'Beyond the beaches, what draws most newcomers is practicality: direct flights of under four hours to Miami and New York, a stable currency-friendly real estate market, and a residency program designed to welcome foreign investment.'],
      ['h', 'Visas and residency pathways'],
      ['p', "Most nationalities can enter the DR as tourists for up to 30 days, extendable on arrival. For those planning to stay, the main routes are temporary residency (renewed annually, leading to permanent residency) and the investor/retiree residency under Law 171-07, which offers significant tax exemptions for qualifying applicants."],
      ['p', 'You do not need residency to buy property — foreigners enjoy the same ownership rights as Dominican citizens — but residency unlocks tax benefits and the right to live in the country long-term.'],
      ['h', 'Finding your first home'],
      ['p', 'Whether you rent first or buy immediately, start by narrowing your region: Punta Cana and Cap Cana for beach and investment, Las Terrenas for a bohemian expat community, Santo Domingo for urban life, or Cabarete for an active, outdoorsy lifestyle. Using a certified agent and a local attorney protects you through the process.'],
      ['h', 'Banking and daily logistics'],
      ['p', 'Opening a local bank account is straightforward with residency or a passport plus references; many expats keep a foreign account alongside a local one. Healthcare is high-quality and affordable in major cities, and international schools with IB and American curricula serve families in every major expat hub.'],
    ],
  },
  'investors-miami': {
    catKey: 'Investing', catLabel: 'Investment Intelligence', read: '12 min', reads: '5,400', date: '2026',
    author: 'Carlos Reyes', role: 'Certified Financial Planner', initials: 'CR',
    title: 'Why Investors Are Choosing the DR Over Miami',
    lede: "ROI comparisons, tax advantages, and why the Caribbean's fastest-growing market is capturing global attention.",
    facts: [['9.8%', 'Top regional ROI (Cap Cana)'], ['12%', 'Annual property appreciation'], ['3%', 'One-time transfer tax'], ['$0', 'Capital gains under CONFOTUR']],
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'The yield gap'],
      ['p', "Investors comparing Miami and the Dominican Republic increasingly find the math favors the Caribbean. Where prime Miami rental yields have compressed to the low single digits, well-chosen DR properties in tourism corridors routinely model 7–10% gross yields, driven by strong short-term rental demand."],
      ['h', 'Tax advantages'],
      ['p', "The DR's CONFOTUR tourism-incentive law can waive transfer taxes and property taxes for qualifying projects, and Law 171-07 offers long-running exemptions for investor residents. Combined, these can materially improve net returns compared with high-tax US jurisdictions."],
      ['h', 'Where the growth is'],
      ['p', "Cap Cana and Punta Cana lead on luxury and appreciation, while emerging areas like Las Terrenas and Cabarete offer lower entry points with strong upside. The common thread is tourism: regions with airport access and established visitor demand carry the most resilient rental economics."],
    ],
  },
  'regions-compare': {
    catKey: 'Buying', catLabel: 'Regions Guide', read: '9 min', reads: '4,100', date: '2026',
    author: 'Ana Peña', role: 'Market Analyst, ILoveDR', initials: 'AP',
    title: 'Punta Cana vs Las Terrenas vs Santo Domingo',
    lede: "A detailed comparison of the DR's top markets for buyers and investors in 2026.",
    facts: [['$1.8M', 'Avg price — Punta Cana'], ['$920K', 'Avg price — Las Terrenas'], ['$640K', 'Avg price — Santo Domingo'], ['3 markets', 'Compared head-to-head']],
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'Punta Cana / Bávaro'],
      ['p', 'The tourism capital. Punta Cana offers the strongest short-term rental demand in the country, luxury beachfront product, and reliable appreciation. Best suited to investors and retirees who want a turnkey vacation-rental asset or a second home in a resort setting.'],
      ['h', 'Las Terrenas'],
      ['p', 'A bohemian, European-flavored expat hub on the Samaná peninsula. Lower entry prices, a walkable town, and a tight-knit community make it a favorite for digital nomads and eco-conscious buyers who prioritize lifestyle over pure yield.'],
      ['h', 'Santo Domingo'],
      ['p', 'The capital delivers urban sophistication: business infrastructure, top hospitals and schools, and year-round (non-seasonal) rental demand. Ideal for families, business owners, and long-term residents rather than vacation-rental investors.'],
    ],
  },
  'residency-2026': {
    catKey: 'Legal', catLabel: 'Legal & Residency', read: '8 min', reads: '2,140', date: '2026',
    author: 'Legal Desk', role: 'ILoveDR', initials: 'LD',
    title: 'How to Get Dominican Residency in 2026',
    lede: 'Step-by-step breakdown of the residency process, required documents, timelines, and costs.',
    facts: [['30–60 days', 'Typical processing time'], ['20 years', 'Tax exemption (Law 171-07)'], ['Not required', 'To buy property'], ['2 routes', 'Temporary & investor/retiree']],
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'The two main routes'],
      ['p', 'Most applicants choose either standard temporary residency (renewed annually toward permanent status) or the investor/retiree residency under Law 171-07, which rewards qualifying investment or pension income with long-running tax exemptions.'],
      ['h', "Documents you'll need"],
      ['p', 'Expect to provide a valid passport, birth certificate, police clearance, medical certificate, and proof of income or investment — all apostilled and translated. A local immigration attorney streamlines the process considerably.'],
      ['h', 'Timeline and cost'],
      ['p', 'From a complete application, residency typically processes in 30–60 days. Budget for government fees, attorney fees, and document legalization; the investor route costs more upfront but pays back through tax savings.'],
    ],
  },
  'property-law': {
    catKey: 'Legal', catLabel: 'Legal & Tax', read: '14 min', reads: '3,820', date: '2026',
    author: 'Legal Desk', role: 'ILoveDR', initials: 'LD',
    title: 'Understanding Dominican Property Law for Foreign Buyers',
    lede: 'Title certificates, Título de Propiedad, due diligence, and protecting your investment.',
    facts: [['Equal rights', 'Foreigners own outright'], ['~30 days', 'Due-diligence period'], ['Título', 'Verify at the Registrar'], ['Required', 'Hire a local attorney']],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'Foreigners can own outright'],
      ['p', 'There are no restrictions on foreign ownership of Dominican real estate — you can hold title in your own name with the same rights as a citizen.'],
      ['h', 'Title and due diligence'],
      ['p', "Every purchase should begin with a title search at the Registry of Titles to confirm clean ownership, no liens, and accurate boundaries. The Título de Propiedad is the definitive ownership document. A boundary survey and municipal records check round out due diligence."],
      ['h', 'Protecting your investment'],
      ['p', "Never skip a local real estate attorney. They verify the title, structure the promise-of-sale contract, hold deposits in escrow, and manage the closing at the notary — the single best protection against fraud or boundary disputes."],
    ],
  },
  'tax-171-07': {
    catKey: 'Investing', catLabel: 'Tax Strategy', read: '10 min', reads: '5,100', date: '2026',
    author: 'Carlos Reyes', role: 'Certified Financial Planner', initials: 'CR',
    title: 'Tax Benefits: Law 171-07 Explained',
    lede: "How the DR's special residency exempts you from income, capital gains, and import taxes for 20 years.",
    facts: [['20 years', 'Exemption window'], ['$0', 'Tax on foreign income'], ['$0', 'Capital gains (qualifying)'], ['Duty-free', 'Household & vehicle import']],
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'What Law 171-07 offers'],
      ['p', 'Designed to attract retirees and investors, Law 171-07 grants qualifying residents a long list of exemptions: on foreign-sourced income, on a portion of capital gains, on property transfer for a first home, and duty-free importation of household goods and a vehicle.'],
      ['h', 'Who qualifies'],
      ['p', 'The retiree route requires verifiable pension income; the investor route requires a qualifying investment in the country. Both lead to residency plus the exemption package.'],
      ['h', 'Why it matters'],
      ['p', 'For higher-income individuals relocating from high-tax jurisdictions, these exemptions can be the deciding financial factor — often outweighing the cost of the move within the first few years.'],
    ],
  },
  'cost-of-living': {
    catKey: 'Lifestyle', catLabel: 'Lifestyle', read: '7 min', reads: '8,900', date: '2026',
    author: 'Maria Cruz', role: 'Relocation Lead, ILoveDR', initials: 'MC',
    title: 'Real Cost of Living in the DR — 2026 Breakdown',
    lede: 'Groceries, utilities, dining, healthcare, and private schooling — honest numbers from real expats.',
    facts: [['$1,400', 'Avg single-person monthly'], ['$2,800', 'Comfortable family budget'], ['~60%', 'Cheaper than Miami'], ['$50–150', 'Monthly private health plan']],
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'A realistic monthly budget'],
      ['p', 'A single person living comfortably outside the most touristy zones can budget around $1,400/month including rent; a family targeting private schooling and help budgets closer to $2,800–4,000. Costs rise sharply in gated resort communities and fall in local neighborhoods.'],
      ['h', 'Where the savings are'],
      ['p', 'Fresh produce, local dining, domestic help, and healthcare are dramatically cheaper than in North America. Imported goods, electronics, and cars are where prices climb toward — or above — US levels.'],
      ['h', 'Healthcare and schooling'],
      ['p', 'Private health plans are affordable and care quality is high in major cities. International schools charge a fraction of US private-school tuition while offering IB and American curricula.'],
    ],
  },
  'schools': {
    catKey: 'Lifestyle', catLabel: 'Family & Education', read: '11 min', reads: '4,200', date: '2026',
    author: 'Maria Cruz', role: 'Relocation Lead, ILoveDR', initials: 'MC',
    title: 'Best International Schools for Expat Families',
    lede: 'IB programmes, American curricula, tuition ranges, and the best neighborhoods for families with children.',
    facts: [['IB & US', 'Curricula available'], ['Santo Domingo', 'Most options'], ['Punta Cana', 'Growing fast'], ['Lower cost', 'Vs US private schools']],
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'Curricula and accreditation'],
      ['p', 'The DR hosts well-regarded international schools offering International Baccalaureate and American curricula, many accredited by US and international bodies, easing transfers back home or to university abroad.'],
      ['h', 'Where families settle'],
      ['p', "Santo Domingo offers the widest choice of established schools, while Punta Cana's options are expanding quickly to serve its growing expat population. Proximity to a good school often drives the neighborhood decision."],
      ['h', 'Budgeting tuition'],
      ['p', "Tuition varies widely but generally costs a fraction of comparable US private schools, making quality international education one of the DR's underrated family advantages."],
    ],
  },
  'healthcare': {
    catKey: 'Lifestyle', catLabel: 'Health & Wellness', read: '9 min', reads: '3,400', date: '2026',
    author: 'Maria Cruz', role: 'Relocation Lead, ILoveDR', initials: 'MC',
    title: 'Healthcare in the DR — What You Need to Know',
    lede: 'Top hospitals, international insurance recommendations, and why medical tourism is booming in Punta Cana.',
    facts: [['High quality', 'Private hospitals'], ['$50–150', 'Monthly insurance'], ['Booming', 'Medical tourism'], ['Major cities', 'Best facilities']],
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop',
    body: [
      ['h', 'Quality and access'],
      ['p', 'Private hospitals in Santo Domingo, Santiago, and Punta Cana offer modern facilities and English-speaking, often US-trained physicians. Care quality in these centers is high and wait times are short compared to many home countries.'],
      ['h', 'Insurance'],
      ['p', 'Affordable local private plans cover most needs; expats with global lifestyles often pair a local plan with international coverage. Monthly premiums are a fraction of US costs.'],
      ['h', 'Medical tourism'],
      ['p', 'Punta Cana in particular has become a medical-tourism hub for dental, cosmetic, and elective procedures, drawing visitors who combine treatment with a beach stay.'],
    ],
  },
}
