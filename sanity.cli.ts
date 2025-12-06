import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-04-08', // use current UTC date - see "specifying API version"!
  useCdn: process.env.NODE_ENV === 'production', // if you're using ISR or only static generation at build time then you can set this to `false` to guarantee no stale content
})