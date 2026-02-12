import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  defaultColors,
} from '@payloadcms/richtext-lexical';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { buildConfig } from 'payload';

import { Articles } from './collections/Articles';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Users } from './collections/Users';
import { Navigation } from './globals/Navigation';
import { SiteSettings } from './globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
    },
  },
  collections: [Users, Media, Articles, Pages, Categories],
  globals: [SiteSettings, Navigation],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Polski',
        code: 'pl',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      InlineCodeFeature(),

      ParagraphFeature(),
      HeadingFeature({
        enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      }),

      AlignFeature(),
      IndentFeature(),

      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),

      LinkFeature({
        enabledCollections: ['pages'],
      }),
      BlockquoteFeature(),

      HorizontalRuleFeature(),

      EXPERIMENTAL_TableFeature(),

      UploadFeature({
        collections: {
          media: {
            fields: [],
          },
        },
      }),

      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
            ...defaultColors.background,
          },
        },
      }),

      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
