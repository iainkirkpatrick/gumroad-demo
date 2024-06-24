import { JSONContent } from "@tiptap/react"

import { TierT } from "./Tier"

export type ProductNativeType = 'digital' | 'course' | 'ebook' | 'membership' | 'physical' | 'bundle' | 'coffee' | 'commissions' | 'calls'

export type ProductT = {
  name: string
  public_id: string
  native_type: ProductNativeType
  created_at: string
  updated_at: string
  description?: string
  price_range?: string
  price_currency_type?: string
  rich_content?: JSONContent
  is_physical?: boolean
  is_published?: boolean
  call_link?: string
  thanks_message?: string
  tiers?: Array<TierT>
}