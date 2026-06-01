export interface Principal {
  id: string; name: string; role: string; team: string | null
  bio: string; langs: string; region: string; v: number; img: string
}

export interface Agent {
  name: string; role: string; team: string; specialty: string
  bio: string; langs: string; region: string; v: number; img: string
}

export const PRINCIPALS: Principal[] = [
  { id: 'emil',   name: 'Emil Rodríguez', role: 'Co-Founder · Principal Broker',   team: 'Rodríguez Realty Group',
    bio: "Born and raised in Santo Domingo, Emil brings two decades of local market knowledge and a deep network across the DR's brokerage community. He leads listings quality and seller relationships.",
    langs: 'ES · EN',      region: 'Santo Domingo · Nationwide',             v: 0,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop' },
  { id: 'siam',   name: 'Siam Castillo',  role: 'Co-Founder · Principal Broker',   team: 'Castillo & Co.',
    bio: 'Siam focuses on growth, brand, and the buyer experience — making sure every visitor, whether local or from the diaspora, finds a platform they trust and enjoy using.',
    langs: 'ES · EN',      region: 'Punta Cana · Cap Cana',                  v: 1,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop' },
  { id: 'xavier', name: 'Xavier Pérez',   role: 'Co-Founder · Principal Broker',   team: 'Pérez Relocation Partners',
    bio: 'An investor and relocation specialist, Xavier personally vets the realtors on the platform and guides international buyers through residency, tax, and the realities of owning in the DR.',
    langs: 'ES · EN · FR', region: 'Las Terrenas · Samaná · Cabarete',      v: 2,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop' },
  { id: 'steve',  name: 'Steve Mitchell', role: 'Co-Founder · Operations & Tech',  team: null,
    bio: "Steve oversees product and partnerships, connecting the platform's technology with the on-the-ground expertise that makes buying and selling in the DR straightforward.",
    langs: 'EN · ES',      region: 'Platform-wide',                          v: 3,
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop' },
]

export const AGENTS: Agent[] = [
  // Emil's team — Rodríguez Realty Group
  { name: 'Carla Méndez',       role: 'Senior Agent',   team: 'emil',   specialty: 'Luxury Residential',
    bio: "Carla specializes in high-rise condos in Piantini and Naco, with eight years guiding diaspora buyers through Santo Domingo's most prestigious neighborhoods.",
    langs: 'ES · EN', region: 'Santo Domingo', v: 0,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop' },
  { name: 'Roberto Almonte',    role: 'Senior Agent',   team: 'emil',   specialty: 'Commercial',
    bio: 'Roberto handles commercial and mixed-use deals across the capital — office space, ground-floor retail, and warehouse property for investors expanding into the DR.',
    langs: 'ES', region: 'Santo Domingo Este · Distrito Nacional', v: 1,
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop' },

  // Siam's team — Castillo & Co.
  { name: 'Ana Lucía Reyes',    role: 'Senior Agent',   team: 'siam',   specialty: 'Resort & Vacation',
    bio: 'Punta Cana resort-property specialist. Ana Lucía has closed over 40 vacation-rental units in Bávaro and Cap Cana since 2021 and manages an active rental portfolio.',
    langs: 'ES · EN · RU', region: 'Punta Cana · Bávaro', v: 2,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop' },
  { name: 'Diego Fernández',    role: 'Agent',          team: 'siam',   specialty: 'New Construction',
    bio: 'Diego works directly with developers on pre-construction inventory — Cap Cana, Vista Cana, and emerging beachside projects. Great for buyers who want CONFOTUR-eligible deals.',
    langs: 'ES · EN', region: 'Cap Cana · La Altagracia', v: 3,
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop' },
  { name: 'Patricia Sánchez',   role: 'Agent',          team: 'siam',   specialty: 'Rentals & Short-Term',
    bio: 'Patricia oversees the booking and guest-experience side for owners renting through the platform — turnover, pricing, and direct-booking optimization.',
    langs: 'ES · EN', region: 'Punta Cana', v: 0,
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop' },

  // Xavier's team — Pérez Relocation Partners
  { name: 'Juan Manuel Báez',   role: 'Senior Agent',   team: 'xavier', specialty: 'Beachfront & Land',
    bio: "Las Terrenas-based for fifteen years, Juan Manuel handles beachfront villas and undeveloped land across the Samaná peninsula — the market most foreign buyers don't know how to navigate.",
    langs: 'ES · EN · FR', region: 'Las Terrenas · Samaná', v: 1,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop' },
  { name: 'Marie-Claire Joseph', role: 'Agent',         team: 'xavier', specialty: 'Relocation',
    bio: 'Marie-Claire walks Canadian and European clients through residency applications, school placement, and the first 90 days on the ground. Speaks four languages fluently.',
    langs: 'FR · EN · ES · IT', region: 'Cabarete · Sosúa', v: 2,
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop' },
  { name: 'Jonathan Smith',     role: "Buyer's Agent",  team: 'xavier', specialty: 'Diaspora & US Buyers',
    bio: 'US-based referring agent. Jonathan onboards American clients before they arrive — initial consultation, financing pre-qualification, and a vetted handoff to an on-island agent.',
    langs: 'EN · ES', region: 'US-based · Remote', v: 3,
    img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80&auto=format&fit=crop' },
]

export const TEAM_STATS: [string, string, string][] = [
  ['4',   'Principals', '#f0a800'],
  ['8',   'Agents',     '#e10f1f'],
  ['10+', 'Regions',    '#0b63ab'],
  ['5',   'Languages',  '#1f7a3d'],
]
