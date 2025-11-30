/**
 * DEFINITIVE Product Image Mapping - FINAL VERSION
 *
 * This file provides the SINGLE SOURCE OF TRUTH for mapping products to their images.
 *
 * ONLY products with exact matching images from figma design/items/ folder:
 * - mango.png = Fresh tropical mango
 * - avocado.png = Ripe avocado
 * - strawberry.png = Fresh strawberries
 * - grapes.png = Red/purple grapes
 * - orange.png = Fresh oranges
 * - banana.png = Ripe bananas
 * - blueberries.png = Fresh blueberries
 * - pomegranate.png = Fresh pomegranate
 * - fig.png = Fresh figs
 */

export const productImageMap: Record<string, string> = {
  // By Product ID (descriptive IDs)
  mango: 'mango',
  avocado: 'avocado',
  strawberry: 'strawberry',
  grapes: 'grapes',
  orange: 'orange',
  banana: 'banana',
  blueberries: 'blueberries',
  pomegranate: 'pomegranate',
  fig: 'fig',
  durian: 'durian',
  bread: 'bread',
  chicken: 'chicken',
  'avocado-premium': 'avocadoPremium',

  // By Product Name (for flexible matching)
  'fresh mango': 'mango',
  'ripe mango': 'mango',

  'fresh avocado': 'avocado',
  'ripe avocado': 'avocado',

  'fresh strawberries': 'strawberry',
  strawberries: 'strawberry',

  'red grapes': 'grapes',
  'purple grapes': 'grapes',

  'fresh orange': 'orange',
  'sweet orange': 'orange',
  oranges: 'orange',

  'ripe banana': 'banana',
  bananas: 'banana',
  'yellow banana': 'banana',

  'fresh blueberries': 'blueberries',
  blueberry: 'blueberries',

  'fresh pomegranate': 'pomegranate',

  'fresh fig': 'fig',
  figs: 'fig',

  'exotic durian': 'durian',
  'fresh durian': 'durian',

  'fresh bread': 'bread',
  'artisan bread': 'bread',
  'whole wheat bread': 'bread',

  'fresh chicken': 'chicken',
  'chicken breast': 'chicken',
  'organic chicken': 'chicken',

  'premium avocado': 'avocadoPremium',
  'organic avocado': 'avocadoPremium',
};

/**
 * Get imageKey for a product by ID or name
 */
export const getImageKeyForProduct = (productIdOrName: string): string | undefined => {
  // Try direct lookup first
  const directMatch = productImageMap[productIdOrName];
  if (directMatch) return directMatch;

  // Try lowercase lookup
  const lowerMatch = productImageMap[productIdOrName.toLowerCase()];
  if (lowerMatch) return lowerMatch;

  // Try partial match in product name
  const lowerSearch = productIdOrName.toLowerCase();
  for (const [key, value] of Object.entries(productImageMap)) {
    if (key.includes(lowerSearch) || lowerSearch.includes(key)) {
      return value;
    }
  }

  return undefined; // No match found
};
