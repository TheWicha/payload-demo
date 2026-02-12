import type { Field, GlobalConfig } from 'payload';

import { admins } from '../collections/access/admins';
import { anyone } from '../collections/access/anyone';

const navItemFields: Field[] = [
  {
    name: 'label',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'type',
    type: 'radio' as const,
    defaultValue: 'page',
    options: [
      { label: 'Internal Page', value: 'page' },
      { label: 'Custom URL', value: 'custom' },
    ],
    admin: {
      layout: 'horizontal' as const,
    },
  },
  {
    name: 'page',
    type: 'relationship' as const,
    relationTo: 'pages' as const,
    admin: {
      condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.type === 'page',
      description: 'Select an internal page.',
    },
  },
  {
    name: 'url',
    type: 'text' as const,
    admin: {
      condition: (_: unknown, siblingData: Record<string, unknown>) =>
        siblingData?.type === 'custom',
      description: 'Enter a custom URL (e.g. /articles or https://example.com).',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox' as const,
    defaultValue: false,
  },
];

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
    description: 'Configure header and footer navigation menus.',
  },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'headerItems',
      type: 'array',
      label: 'Header Navigation',
      admin: {
        description: 'Links displayed in the site header.',
      },
      fields: navItemFields,
    },
    {
      name: 'footerItems',
      type: 'array',
      label: 'Footer Navigation',
      admin: {
        description: 'Links displayed in the site footer.',
      },
      fields: navItemFields,
    },
  ],
};
