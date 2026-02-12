import type { GlobalConfig } from 'payload'

import { admins } from '../collections/access/admins'
import { anyone } from '../collections/access/anyone'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Global site configuration — name, SEO defaults, social links.',
  },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Payload Demo',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              admin: {
                description: 'Used as the default meta description across the site.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site logo displayed in the header.',
              },
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'defaultMetaImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Fallback image for social sharing when no specific image is set.',
              },
            },
            {
              name: 'defaultMetaTitle',
              type: 'text',
              admin: {
                description: 'Appended to page titles (e.g. " | My Site").',
              },
            },
          ],
        },
        {
          label: 'Social & Footer',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              admin: {
                description: 'Social media links displayed in the footer.',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'GitHub', value: 'github' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'footerText',
              type: 'richText',
              admin: {
                description: 'Rich text content displayed in the site footer.',
              },
            },
          ],
        },
      ],
    },
  ],
}
