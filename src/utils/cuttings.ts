import { getCollection } from 'astro:content';
import type { Cuttings } from '../types';

type Options = {
  num: number | 'all';
};

/**
 * Fetches cultivated thoughts sorted by publication date (newest first)
 * @param options - Configuration options
 * @param options.numberOfThoughts - Number of thoughts to return, or "all" for all thoughts
 * @returns Promise resolving to filtered and sorted cultivated thoughts
 */
export async function getCuttings({ num }: Options): Promise<Cuttings> {
  const cuttings = await getCollection('cuttings');
  const sorted = cuttings.sort((a, b) => b.data.createdAt.valueOf() - a.data.createdAt.valueOf());

  if (num === 'all') {
    return sorted;
  }

  return sorted.slice(0, num);
}

/**
 * Fetches all cultivated thoughts sorted by publication date (newest first)
 * @returns Promise resolving to all cultivated thoughts
 */
export async function getAllCuttings(): Promise<Cuttings> {
  return await getCuttings({ num: 'all' });
}
