export const PRODUCT_TYPES = [
  'cigarette',
  'vape_puffs',
  'vape_pods',
  'rolling',
  'cigarillo',
  'cigar',
  'pipe',
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

interface ProductConfig {
  emoji: string;
  quantityCadence: 'day' | 'week';
  unitsPerPrice: number;
  defaultQuantity: number;
  defaultPrice: number;
  min: number;
  max: number;
}

export const PRODUCT_CONFIG: Record<ProductType, ProductConfig> = {
  cigarette: {
    emoji: '🚬',
    quantityCadence: 'day',
    unitsPerPrice: 20,
    defaultQuantity: 10,
    defaultPrice: 11.5,
    min: 1,
    max: 60,
  },
  vape_puffs: {
    emoji: '💨',
    quantityCadence: 'day',
    unitsPerPrice: 600,
    defaultQuantity: 180,
    defaultPrice: 8.9,
    min: 20,
    max: 800,
  },
  vape_pods: {
    emoji: '💨',
    quantityCadence: 'week',
    unitsPerPrice: 1,
    defaultQuantity: 2,
    defaultPrice: 9.9,
    min: 1,
    max: 14,
  },
  rolling: {
    emoji: '🪄',
    quantityCadence: 'day',
    unitsPerPrice: 100,
    defaultQuantity: 12,
    defaultPrice: 18.5,
    min: 1,
    max: 60,
  },
  cigarillo: {
    emoji: '🍂',
    quantityCadence: 'day',
    unitsPerPrice: 10,
    defaultQuantity: 4,
    defaultPrice: 12,
    min: 1,
    max: 30,
  },
  cigar: {
    emoji: '🎩',
    quantityCadence: 'week',
    unitsPerPrice: 1,
    defaultQuantity: 3,
    defaultPrice: 9,
    min: 1,
    max: 14,
  },
  pipe: {
    emoji: '🌿',
    quantityCadence: 'day',
    unitsPerPrice: 25,
    defaultQuantity: 3,
    defaultPrice: 16,
    min: 1,
    max: 20,
  },
} as const;

export function getProductConfig(productType: ProductType = 'cigarette') {
  return PRODUCT_CONFIG[productType];
}
