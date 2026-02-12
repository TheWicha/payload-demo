import type { Block, CollectionConfig } from 'payload'

import { admins } from './access/admins'
import { adminsOrPublished } from './access/adminsOrPublished'
import { populateSlug } from './hooks/populateSlug'

// --- Layout Blocks ---

const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'URL or path (e.g. /articles or https://example.com)',
          },
        },
      ],
    },
  ],
}

const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Content',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Two Columns', value: 'half' },
        { label: 'Three Columns', value: 'third' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
}

const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: {
    singular: 'Media',
    plural: 'Media Blocks',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'CTAs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      admin: {
        description: 'URL or path for the CTA button.',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      required: true,
      defaultValue: 'Learn More',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
    },
  ],
}

const ArchiveBlock: Block = {
  slug: 'archive',
  labels: {
    singular: 'Archive',
    plural: 'Archives',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Latest Articles',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Latest', value: 'latest' },
        { label: 'By Category', value: 'category' },
        { label: 'Manual Selection', value: 'selection' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'category',
        description: 'Filter articles by this category.',
      },
    },
    {
      name: 'selectedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Manually select which articles to show.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 24,
      admin: {
        description: 'Maximum number of articles to show.',
      },
    },
  ],
}

// --- Pages Collection ---

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Static pages with a flexible layout builder.',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
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
    maxPerDoc: 10,
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
              name: 'layout',
              type: 'blocks',
              blocks: [HeroBlock, ContentBlock, MediaBlock, CTABlock, ArchiveBlock],
              admin: {
                description: 'Build your page layout by adding blocks.',
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
                    description: 'Custom title for search engines. Defaults to page title.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Custom description for search engines.',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Custom image for social sharing.',
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
