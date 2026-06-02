import type { Metadata } from 'next'
import ArticleDetail from '../../../views/ArticleDetail'
import { ARTICLES } from '../../../data/blogData'

export function generateStaticParams() {
  return Object.keys(ARTICLES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES[slug]
  if (!a) return { title: 'Article Not Found' }
  return {
    title: `${a.title} | I Love DR Realty`,
    description: a.lede,
    openGraph: { title: a.title, description: a.lede, images: [a.img] },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleDetail slug={slug} />
}
