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
      if (doc.type === 'video-art') return `/videos-art/${doc._raw.flattenedPath.split('/').pop()}`
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
    image: { type: 'string', required: false },
    type: { type: 'string', required: false },
    duree: { type: 'string', required: false },
    annee: { type: 'string', required: false },
    order: { type: 'number', required: false },
    vimeoId: { type: 'string', required: false },
    shortSynopsis: { type: 'string', required: false },
    // Fiche technique
    realisation: { type: 'string', required: false },
    mixage: { type: 'string', required: false },
    son: { type: 'string', required: false },
    texte: { type: 'string', required: false },
    musique: { type: 'string', required: false },
    montage: { type: 'string', required: false },
    avec: { type: 'string', required: false },
    production: { type: 'string', required: false },
    // Diffusion/Sélection
    diffusion: { type: 'list', of: { type: 'string' }, required: false },
    selection: { type: 'list', of: { type: 'string' }, required: false },
    // Lien film
    lienFilm: { type: 'string', required: false },
    // Remerciements
    remerciements: { type: 'string', required: false },
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
    cover: { type: 'string', required: false },
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
    subtitle: { type: 'string', required: false },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    cover: { type: 'string', required: false },
    location: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields,
}))

export const VideoArt = defineDocumentType(() => ({
  name: 'VideoArt',
  filePathPattern: `videos-art/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    image: { type: 'string', required: false },
    type: { type: 'string', required: false },
    duree: { type: 'string', required: false },
    annee: { type: 'string', required: false },
    vimeoId: { type: 'string', required: false },
    shortSynopsis: { type: 'string', required: false },
    realisation: { type: 'string', required: false },
    mixage: { type: 'string', required: false },
    texte: { type: 'string', required: false },
    production: { type: 'string', required: false },
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
  documentTypes: [Film, Mediation, Actu, VideoArt, Page],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})