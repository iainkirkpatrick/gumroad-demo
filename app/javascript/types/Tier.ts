import { JSONContent } from "@tiptap/react"

export type TierT = {
  public_id: string
  created_at: string
  updated_at: string
  product_id: number
  name?: string
  price?: string
  description?: string
  rich_content?: JSONContent
}