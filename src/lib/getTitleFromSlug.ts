/**
 * Extracts the last segment from a slug path
 * @param slug - The slug path to extract from (e.g., "blog/posts/my-post")
 * @returns The last segment of the slug (e.g., "my-post")
 * @example
 * getTitleFromSlug("food/desserts/chocolate-cake") // returns "chocolate-cake"
 * getTitleFromSlug("my-post") // returns "my-post"
 */
export function getTitleFromSlug(slug: string): string {
  if (!slug || slug.trim() === '') {
    return '';
  }

  // Remove trailing slashes and get the last segment
  const cleanedSlug = slug.trim().replace(/\/+$/, '');
  const segments = cleanedSlug.split('/');

  return segments.at(-1) || '';
}
