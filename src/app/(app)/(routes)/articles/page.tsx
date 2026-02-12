import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../../payload.config'
import { Gutter } from '../../_components/Gutter'
import classes from './page.module.scss'

export const metadata = {
  title: 'Articles | Payload Demo',
  description: 'Browse all published articles.',
}

export default async function ArticlesPage() {
  const payload = await getPayload({ config })

  const articles = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
    depth: 1,
  })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 50,
  })

  return (
    <Gutter>
      <div className={classes.header}>
        <h1>Articles</h1>
        <p className={classes.subtitle}>
          {articles.totalDocs} article{articles.totalDocs !== 1 ? 's' : ''} published
        </p>
      </div>

      {categories.docs.length > 0 && (
        <div className={classes.categories}>
          <Link href="/articles" className={classes.categoryTag}>
            All
          </Link>
          {categories.docs.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={classes.categoryTag}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      {articles.docs.length === 0 ? (
        <p>No articles published yet. Head to the <Link href="/admin">admin panel</Link> to create some.</p>
      ) : (
        <div className={classes.grid}>
          {articles.docs.map((article) => {
            const author = typeof article.author === 'object' ? article.author : null
            const category = typeof article.category === 'object' ? article.category : null
            const heroImage = typeof article.heroImage === 'object' ? article.heroImage : null

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={classes.card}
              >
                {heroImage?.url && (
                  <div className={classes.cardImage}>
                    <Image
                      src={heroImage.url}
                      alt={heroImage.alt || article.title}
                      width={heroImage.width || 768}
                      height={heroImage.height || 512}
                    />
                  </div>
                )}
                <div className={classes.cardContent}>
                  {category && (
                    <span className={classes.cardCategory}>{category.title}</span>
                  )}
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
