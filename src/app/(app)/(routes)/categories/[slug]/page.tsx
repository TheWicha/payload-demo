import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../../../payload.config'
import { Gutter } from '../../../_components/Gutter'
import classes from './page.module.scss'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const category = categoryResult.docs[0]

  if (!category) {
    notFound()
  }

  const articles = await payload.find({
    collection: 'articles',
    where: {
      category: { equals: category.id },
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
    depth: 1,
    limit: 20,
  })

  return (
    <Gutter>
      <div className={classes.breadcrumbs}>
        <Link href="/categories">Categories</Link>
        <span className={classes.separator}>/</span>
        <span>{category.title}</span>
      </div>

      <div className={classes.header}>
        <h1>{category.title}</h1>
        {category.description && (
          <p className={classes.description}>{category.description}</p>
        )}
        <p className={classes.count}>
          {articles.totalDocs} article{articles.totalDocs !== 1 ? 's' : ''}
        </p>
      </div>

      {articles.docs.length === 0 ? (
        <p>No published articles in this category yet.</p>
      ) : (
        <div className={classes.list}>
          {articles.docs.map((article) => {
            const author = typeof article.author === 'object' ? article.author : null
            const heroImage = typeof article.heroImage === 'object' ? article.heroImage : null

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={classes.card}
              >
                {heroImage?.url && (
                  <div className={classes.cardImage}>
                    <img src={heroImage.url} alt={heroImage.alt || article.title} />
                  </div>
                )}
                <div className={classes.cardContent}>
                  <h2 className={classes.cardTitle}>{article.title}</h2>
                  {article.excerpt && (
                    <p className={classes.cardExcerpt}>{article.excerpt}</p>
                  )}
                  <div className={classes.cardMeta}>
                    {author && (
                      <span>
                        {author.firstName} {author.lastName}
                      </span>
                    )}
                    {article.publishedAt && (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Gutter>
  )
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const category = result.docs[0]

  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${category.title} | Payload Demo`,
    description: category.description || `Articles in ${category.title}`,
  }
}
