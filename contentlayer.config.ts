import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc: any) => doc._raw.flattenedPath.split('/').pop(),
  },
  url: {
    type: 'string',
    resolve: (doc: any) => {
      const base = doc._raw.sourceFileDir
      if (doc.type === 'atelier') return `/ateliers/${doc._raw.flattenedPath.split('/').pop()}`
      if (doc.type === 'film') return `/films/${doc._raw.flattenedPath.split('/').pop()}`
      if (doc.type === 'actu') return `/actus/${doc._raw.flattenedPath.split('/').pop()}`
      return `/${doc._raw.flattenedPath}`
    },
  },
}

export const Atelier = defineDocumentType(() => ({
  name: 'Atelier',
  filePathPattern: `ateliers/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    lieu: { type: 'string', required: true },
    duree: { type: 'string', required: false },
    modalites: { type: 'markdown', required: false },
    lien_inscription: { type: 'string', required: false },
    gallery: { type: 'list', of: { type: 'string' }, required: false },
    excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    seo_title: { type: 'string', required: false },
    seo_description: { type: 'string', required: false },
    seo_image: { type: 'string', required: false },
    noindex: { type: 'boolean', required: false },
  },
  computedFields,
}))

export const Film = defineDocumentType(() => ({
  name: 'Film',
  filePathPattern: `films/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    annee: { type: 'number', required: true },
    duree: { type: 'string', required: false },
    synopsis: { type: 'string', required: false },
    statut: { type: 'string', required: false },
    vimeo: { type: 'string', required: false },
    youtube: { type: 'string', required: false },
    credits: { type: 'markdown', required: false },
    selections: { type: 'list', of: { type: 'string' }, required: false },
    cover: { type: 'string', required: false },
    gallery: { type: 'list', of: { type: 'string' }, required: false },
    excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    seo_title: { type: 'string', required: false },
    seo_description: { type: 'string', required: false },
    seo_image: { type: 'string', required: false },
    noindex: { type: 'boolean', required: false },
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
    cover: { type: 'string', required: false },
    excerpt: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    seo_title: { type: 'string', required: false },
    seo_description: { type: 'string', required: false },
    seo_image: { type: 'string', required: false },
    noindex: { type: 'boolean', required: false },
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
    cta_link: { type: 'string', required: false },
    seo_title: { type: 'string', required: false },
    seo_description: { type: 'string', required: false },
    seo_image: { type: 'string', required: false },
    noindex: { type: 'boolean', required: false },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Atelier, Film, Actu, Page],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})


