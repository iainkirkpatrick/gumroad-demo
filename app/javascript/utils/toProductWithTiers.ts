import { ProductT } from "../types/Product";

export function toProductWithTiers (product: ProductT) {
  return {
    ...product,
    tiers: product.variants || product.tiers || []
  }
}