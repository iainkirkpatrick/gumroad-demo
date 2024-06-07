export function toProductWithTiers (product: any) {
  return {
    ...product,
    tiers: product.variants || product.tiers || []
  }
}