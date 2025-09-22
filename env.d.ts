declare const SRC: string

declare module "inline:*" {
  const content: string
  export default content
}

interface ImportMeta {
  PKG_DATADIR?: string
}
