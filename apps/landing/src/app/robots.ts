import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NEXT_PUBLIC_SITE_ENV === 'production'

  if (!isProd) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://ilovedrrealty.com/sitemap.xml',
  }
}
