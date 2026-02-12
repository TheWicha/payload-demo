import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../../payload.config'
import { Gutter } from '../../_components/Gutter'
import LexicalRenderer from '../../_components/LexicalRenderer'
import classes from './page.module.scss'

type Args = {
  params: Promise<{ slug: string }>
}

// Render individual layout blocks
function RenderBlocks({ layout }: { layout: any[] }) {
  if (!layout || layout.length === 0) return null

  return (
    <>
      {layout.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <section key={i} className={classes.hero}>
                {block.backgroundImage?.url && (
                  <Image
                    className={classes.heroBg}
                    src={block.backgroundImage.url}
                    alt=""
                    width={block.backgroundImage.width || 1920}
                    height={block.backgroundImage.height || 1080}
                    priority
                  />
                )}
                <div className={classes.heroContent}>
                  <h1 className={classes.heroHeading}>{block.heading}</h1>
                  {block.subheading && (
                    <p className={classes.heroSubheading}>{block.subheading}</p>
                  )}
                  {block.cta?.label && block.cta?.link && (
                    <Link href={block.cta.link} className={classes.heroCta}>
                      {block.cta.label}
                    </Link>
                  )}
                </div>
              </section>
            )

          case 'content':
            return (
              <section
                key={i}
                className={[classes.contentBlock, classes[`columns--${block.layout || 'full'}`]]
                  .filter(Boolean)
                  .join(' ')}
              >
                {block.columns?.map((col: any, j: number) => (
                  <div key={j} className={classes.column}>
                    <LexicalRenderer content={col.content} />
                  </div>
                ))}
              </section>
            )

          case 'mediaBlock':
            const media = typeof block.media === 'object' ? block.media : null
            if (!media?.url) return null
            return (
              <section
                key={i}
                className={[classes.mediaBlock, classes[`media--${block.position || 'center'}`]]
                  .filter(Boolean)
                  .join(' ')}
              >
                <figure>
                  <Image
                    src={media.url}
                    alt={media.alt || ''}
                    width={media.width || 1200}
                    height={media.height || 800}
                  />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              </section>
            )

          case 'cta':
            return (
              <section
                key={i}
                className={[classes.ctaBlock, classes[`cta--${block.style || 'primary'}`]]
                  .filter(Boolean)
                  .join(' ')}
              >
                <h2 className={classes.ctaHeading}>{block.heading}</h2>
                {block.description && (
                  <p className={classes.ctaDescription}>{block.description}</p>
                )}
                <Link href={block.link} className={classes.ctaButton}>
                  {block.linkLabel || 'Learn More'}
                </Link>
              </section>
            )

          case 'archive':
            return <ArchiveBlock key={i} block={block} />

          default:
            return null
        }
      })}
    </>
  )
}

async function ArchiveBlock({ block }: { block: any }) {
  const payload = await getPayload({ config })

  const where: any = { _status: { equals: 'published' } }
  if (block.populateBy === 'category' && block.category) {
    const categoryId = typeof block.category === 'object' ? block.category.id : block.category
    where.category = { equals: categoryId }
  }

  let articles: any[] = []

  if (block.populateBy === 'selection' && block.selectedArticles?.length) {
    const ids = block.selectedArticles.map((a: any) => (typeof a === 'object' ? a.id : a))
    const result = await payload.find({
      collection: 'articles',
      where: { id: { in: ids } },
      depth: 1,
      limit: block.limit || 6,
    })
    articles = result.docs
  } else {
    const result = await payload.find({
      collection: 'articles',
      where,
      sort: '-publishedAt',
      depth: 1,
      limit: block.limit || 6,
    })
    articles = result.docs
  }

  return (
    <section className={classes.archiveBlock}>
      {block.heading && <h2 className={classes.archiveHeading}>{block.heading}</h2>}
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className={classes.archiveGrid}>
          {articles.map((article: any) => {
            const category = typeof article.category === 'object' ? article.category : null
            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={classes.archiveCard}
              >
                {category && (
                  <span className={classes.archiveCategory}>{category.title}</span>
                )}
                <h3 className={classes.archiveTitle}>{article.title}</h3>
                {article.excerpt && (
                  <p className={classes.archiveExcerpt}>{article.excerpt}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default async function DynamicPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    notFound()
  }

  return (
    <Gutter>
      <RenderBlocks layout={page.layout || []} />
    </Gutter>
  )
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) return { title: 'Page Not Found' }

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || '',
  }
}
