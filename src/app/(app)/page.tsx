import { headers as getHeaders } from 'next/headers.js';
import Link from 'next/link';
import { getPayload } from 'payload';
import { Fragment } from 'react';

import config from '../../payload.config';
import { Gutter } from './_components/Gutter';
import { HydrateClientUser } from './_components/HydrateClientUser';
import classes from './page.module.scss';

export default async function HomePage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { permissions, user } = await payload.auth({ headers });

  const articles = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 6,
  });

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 10,
  });

  return (
    <Fragment>
      <HydrateClientUser permissions={permissions} user={user} />
      <Gutter>
        <section className={classes.hero}>
          <h1 className={classes.heroTitle}>Payload CMS Demo</h1>
          <p className={classes.heroSubtitle}>
            A full-featured demo showcasing articles, pages, categories, layout blocks, versioning,
            localization, and role-based access control — all powered by Payload CMS + Next.js.
          </p>
          <div className={classes.heroActions}>
            <Link href="/articles" className={classes.primaryButton}>
              Browse Articles
            </Link>
            <Link href="/admin" className={classes.secondaryButton}>
              Open Admin Panel
            </Link>
          </div>
        </section>

        <section className={classes.features}>
          <div className={classes.featureCard}>
            <h3>Articles & Blog</h3>
            <p>
              Rich text articles with categories, tags, author relationships, SEO fields, and
              draft/publish workflow.
            </p>
          </div>
          <div className={classes.featureCard}>
            <h3>Page Builder</h3>
            <p>
              Flexible layout blocks — heroes, content columns, media, CTAs, and article archives.
              Build any page.
            </p>
          </div>
          <div className={classes.featureCard}>
            <h3>Versioning & Drafts</h3>
            <p>
              Full version history with autosave. Preview drafts before publishing. Roll back to any
              version.
            </p>
          </div>
          <div className={classes.featureCard}>
            <h3>Localization</h3>
            <p>
              Multi-language support (English & Polish) with per-field locale management and
              fallback.
            </p>
          </div>
          <div className={classes.featureCard}>
            <h3>Access Control</h3>
            <p>
              Role-based permissions — admins manage everything, public users see only published
              content.
            </p>
          </div>
          <div className={classes.featureCard}>
            <h3>REST & GraphQL</h3>
            <p>
              Both APIs available out of the box. Query articles, pages, categories, and globals via
              API.
            </p>
          </div>
        </section>

        {categories.docs.length > 0 && (
          <section className={classes.section}>
            <div className={classes.sectionHeader}>
              <h2>Categories</h2>
              <Link href="/categories">View all</Link>
            </div>
            <div className={classes.categoryList}>
              {categories.docs.map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className={classes.categoryTag}>
                  {cat.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.docs.length > 0 && (
          <section className={classes.section}>
            <div className={classes.sectionHeader}>
              <h2>Latest Articles</h2>
              <Link href="/articles">View all</Link>
            </div>
            <div className={classes.articleGrid}>
              {articles.docs.map(article => {
                const category = typeof article.category === 'object' ? article.category : null;
                const author = typeof article.author === 'object' ? article.author : null;

                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className={classes.articleCard}
                  >
                    <div className={classes.articleCardContent}>
                      {category && (
                        <span className={classes.articleCategory}>{category.title}</span>
                      )}
                      <h3 className={classes.articleTitle}>{article.title}</h3>
                      {article.excerpt && (
                        <p className={classes.articleExcerpt}>{article.excerpt}</p>
                      )}
                      <div className={classes.articleMeta}>
                        {author && (
                          <span>
                            {author.firstName} {author.lastName}
                          </span>
                        )}
                        {article.publishedAt && (
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className={classes.ctaBanner}>
          <h2>Explore the Admin Panel</h2>
          <p>
            Log in with <strong>demo@payloadcms.com</strong> / <strong>demo</strong> to manage
            content, create articles, build pages, and configure globals.
          </p>
          <Link href="/login" className={classes.primaryButton}>
            Log In
          </Link>
        </section>
      </Gutter>
    </Fragment>
  );
}
