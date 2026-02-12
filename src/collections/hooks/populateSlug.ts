import type { CollectionBeforeChangeHook } from 'payload'

export const populateSlug: CollectionBeforeChangeHook = ({ data, operation }) => {
  if ((operation === 'create' || operation === 'update') && data?.title) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  return data
}
