import type { CollectionConfig } from 'payload'

import { admins } from './access/admins'
import { adminsOrPublished } from './access/adminsOrPublished'
import { populateSlug } from './hooks/populateSlug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Blog posts and articles.',
    defaultColumns: ['title', 'category', 'author', 'publishedAt', '_status'],
  },
  access: {
    read: adminsOrPublished,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [populateSlug],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'A short summary displayed in article listings.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Featured image for the article.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              admin: {
                description: 'The author of this article.',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
              admin: {
                description: 'Primary category for this article.',
              },
            },
            {
              name: 'tags',
              type: 'array',
              admin: {
                description: 'Tags help users find related content.',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              admin: {
                description: 'Select related articles to display at the bottom.',
              },
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'When to display this article as published.',
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Custom title for search engines. Defaults to article title.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Custom description for search engines. Defaults to excerpt.',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Custom image for social sharing. Defaults to hero image.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. You can override it.',
      },
      index: true,
    },
  ],
}
