import type { CollectionConfig } from 'payload'

import { admins } from './access/admins'
import { anyone } from './access/anyone'
import { populateSlug } from './hooks/populateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Organize articles into categories.',
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [populateSlug],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
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
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
