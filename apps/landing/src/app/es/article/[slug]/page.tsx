import type { Metadata } from 'next'
import ArticleDetail from '../../../../views/ArticleDetail'
import EsLangSync from '../../../../components/EsLangSync'
import { ARTICLES_ES } from '../../../../data/blogData.es'

// One Spanish page per translated article. Untranslated posts have no /es URL.
export function generateStaticParams() {
  return Object.keys(ARTICLES_ES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES_ES[slug]
  if (!a) return { title: 'Artículo no encontrado' }
  const title = a.metaTitle ?? a.title
  const description = a.metaDescription ?? a.lede
  return {
    title,
    description,
    keywords: a.keywords,
    alternates: {
      canonical: `/es/article/${slug}/`,
      languages: {
        en: `/article/${slug}/`,
        es: `/es/article/${slug}/`,
        'x-default': `/article/${slug}/`,
      },
    },
    openGraph: { title, description, images: [a.img], type: 'article', locale: 'es_DO' },
    twitter: { card: 'summary_large_image', title, description, images: [a.img] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = ARTICLES_ES[slug]

  const jsonLd = a
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.title,
          description: a.metaDescription ?? a.lede,
          image: a.img,
          author: { '@type': 'Organization', name: 'I Love DR Realty' },
          publisher: { '@type': 'Organization', name: 'I Love DR Realty' },
          inLanguage: 'es',
        },
        ...(a.faqs && a.faqs.length > 0
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                inLanguage: 'es',
                mainEntity: a.faqs.map(f => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ]
          : []),
      ]
    : []

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <EsLangSync />
      <ArticleDetail slug={slug} lang="es" />
    </>
  )
}
