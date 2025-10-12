import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const computedFields = {
  slug: {
    type: 'string' as const,
    resolve: (doc: any) => doc._raw.flattenedPath.split('/').pop(),
  },
  url: {
    type: 'string' as const,
    resolve: (doc: any) => {
      if (doc.type === 'mediation') return `/mediations/${doc._raw.flattenedPath.split('/').pop()}`
      if (doc.type === 'film') return `/films/${doc._raw.flattenedPath.split('/').pop()}`
      if (doc.type === 'actu') return `/actus/${doc._raw.flattenedPath.split('/').pop()}`
      return `/${doc._raw.flattenedPath}`
    },
  },
}

export const Film = defineDocumentType(() => ({
  name: 'Film',
  filePathPattern: `films/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
  },
  computedFields,
}))

export const Mediation = defineDocumentType(() => ({
  name: 'Mediation',
  filePathPattern: `médiations/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    lieu: { type: 'string', required: true },
    duree: { type: 'string', required: false },
    modalites: { type: 'string', required: false },
    lien_inscription: { type: 'string', required: false },
    excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields,
}))

export const Actu = defineDocumentType(() => ({
  name: 'Actu',
  filePathPattern: `actus/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields,
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    portrait: { type: 'string', required: false },
    hero_video: { type: 'string', required: false },
    hero_image: { type: 'string', required: false },
    cta_text: { type: 'string', required: false },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Film, Mediation, Actu, Page],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})