import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import Image from 'next/image';
import config from '../../../../../payload.config';
import { Gutter } from '../../../_components/Gutter';
import LexicalRenderer from '../../../_components/LexicalRenderer';
import classes from './page.module.scss';

type Args = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'articles',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  });

  const article = result.docs[0];

  if (!article) {
    notFound();
  }

  const author = typeof article.author === 'object' ? article.author : null;
  const category = typeof article.category === 'object' ? article.category : null;
  const heroImage = typeof article.heroImage === 'object' ? article.heroImage : null;

  return (
    <Gutter>
      <article className={classes.article}>
        <div className={classes.breadcrumbs}>
          <Link href="/articles">Articles</Link>
          {category && (
            <>
              <span className={classes.separator}>/</span>
              <Link href={`/categories/${category.slug}`}>{category.title}</Link>
            </>
          )}
        </div>

        <header className={classes.header}>
          {category && <span className={classes.category}>{category.title}</span>}
          <h1 className={classes.title}>{article.title}</h1>
          {article.excerpt && <p className={classes.excerpt}>{article.excerpt}</p>}
          <div className={classes.meta}>
            {author && (
              <span className={classes.author}>
                By {author.firstName} {author.lastName}
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
        </header>

        {heroImage?.url && (
          <div className={classes.heroImage}>
            <Image
              width={heroImage.width || 1200}
              height={heroImage.height || 800}
              src={heroImage.url}
              alt={heroImage.alt || article.title}
            />
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className={classes.tags}>
            {article.tags.map((t, i) => (
              <span key={i} className={classes.tag}>
                {t.tag}
              </span>
            ))}
          </div>
        )}

        <div className={classes.content}>
          <LexicalRenderer content={article.content} />
        </div>

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className={classes.related}>
            <h3>Related Articles</h3>
            <div className={classes.relatedGrid}>
              {article.relatedArticles.map(rel => {
                const related = typeof rel === 'object' ? rel : null;
                if (!related) return null;
                return (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className={classes.relatedCard}
                  >
                    <h4>{related.title}</h4>
                    {related.excerpt && <p>{related.excerpt}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </Gutter>
  );
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  });

  const article = result.docs[0];

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.meta?.title || article.title,
    description: article.meta?.description || article.excerpt || '',
  };
}
