import { getCollection } from 'astro:content';
import type { CultivatedThoughtz } from '../types';

type Options = {
  numberOfThoughts: number | 'all';
};

/**
 * Fetches cultivated thoughts sorted by publication date (newest first)
 * @param options - Configuration options
 * @param options.numberOfThoughts - Number of thoughts to return, or "all" for all thoughts
 * @returns Promise resolving to filtered and sorted cultivated thoughts
 */
export async function getCultivatedThoughtz({
  numberOfThoughts,
}: Options): Promise<CultivatedThoughtz> {
  const thoughts = await getCollection('cultivatedThoughtz');
  const sorted = thoughts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  if (numberOfThoughts === 'all') {
    return sorted;
  }

  return sorted.slice(0, numberOfThoughts);
}

/**
 * Fetches all cultivated thoughts sorted by publication date (newest first)
 * @returns Promise resolving to all cultivated thoughts
 */
export async function getAllCultivatedThoughtz(): Promise<CultivatedThoughtz> {
  return await getCultivatedThoughtz({ numberOfThoughts: 'all' });
}
