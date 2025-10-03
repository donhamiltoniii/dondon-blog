import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type GlobResult = Record<string, () => Promise<{ default: ImageMetadata }>>;

/**
 * Fetches images matching the assetId from a glob result
 * @param assetId - The ID of the photo asset to fetch images for
 * @param globResult - The result from import.meta.glob (injectable for testing)
 * @returns Promise resolving to array of image metadata
 */
export async function getImagesForPhotoAssetFromGlob(
  assetId: string,
  globResult: GlobResult
): Promise<ImageMetadata[]> {
  if (!assetId || assetId.trim() === '') {
    throw new Error('assetId must be a non-empty string');
  }

  const matchingImagePaths = Object.entries(globResult).filter(([path]) => path.includes(assetId));

  if (matchingImagePaths.length === 0) {
    return [];
  }

  const resolvedImages = await Promise.all(
    matchingImagePaths.map(([, imageFn]) => imageFn().then(mod => mod.default))
  );

  return resolvedImages;
}

/**
 * Fetches all images associated with a specific photo asset
 * @param assetId - The ID of the photo asset to fetch images for
 * @returns Promise resolving to array of image metadata
 */
export async function getImagesForPhotoAsset(assetId: string): Promise<ImageMetadata[]> {
  const allImages = import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/photos/**/*.{jpeg,jpg,webp}'
  );

  return getImagesForPhotoAssetFromGlob(assetId, allImages);
}

/**
 * Fetches all photo assets from the photos collection
 * @returns Promise resolving to all photo collection entries
 */
export async function getPhotoAssets(): Promise<CollectionEntry<'photos'>[]> {
  return await getCollection('photos');
}
