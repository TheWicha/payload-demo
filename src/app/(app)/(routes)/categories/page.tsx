import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../../payload.config'
import { Gutter } from '../../_components/Gutter'
import classes from './page.module.scss'

export const metadata = {
  title: 'Categories | Payload Demo',
  description: 'Browse content by category.',
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 50,
  })

  // Fetch article counts per category
  const categoriesWithCounts = await Promise.all(
    categories.docs.map(async (cat) => {
      const articles = await payload.count({
        collection: 'articles',
        where: {
          category: { equals: cat.id },
          _status: { equals: 'published' },
        },
      })
      return { ...cat, articleCount: articles.totalDocs }
    }),
  )

  return (
    <Gutter>
      <div className={classes.header}>
        <h1>Categories</h1>
        <p className={classes.subtitle}>Browse articles by topic</p>
      </div>

      {categoriesWithCounts.length === 0 ? (
        <p>
          No categories yet. Head to the <Link href="/admin">admin panel</Link> to create some.
        </p>
      ) : (
        <div className={classes.grid}>
          {categoriesWithCounts.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className={classes.card}>
              <h2 className={classes.cardTitle}>{cat.title}</h2>
              {cat.description && (
                <p className={classes.cardDescription}>{cat.description}</p>
              )}
              <span className={classes.cardCount}>
                {cat.articleCount} article{cat.articleCount !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Gutter>
  )
}
