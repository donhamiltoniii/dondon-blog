// src/lib/recentContent.ts
import { getCollection } from 'astro:content';

export type ContentItem = {
  id: string;
  slug: string;
  collection: string;
  title: string;
  sortDate: Date;
  isUpdate: boolean;
  url: string;
};

export async function getRecentContent(limit = 10): Promise<ContentItem[]> {
  const [code, thoughts, seeds] = await Promise.all([
    getCollection('code', e => e.data.published !== false),
    getCollection('cultivatedThoughtz'),
    getCollection('seeds'),
  ]);

  const normalize = (
    items: typeof code | typeof thoughts | typeof seeds,
    collection: string,
    urlPrefix: string
  ) =>
    items.map(item => {
      const published = item.data.createdAt;
      const updated = item.data.updatedAt;
      const sortDate = updated && updated > published ? updated : published;

      return {
        id: item.id,
        slug: item.id,
        collection,
        title: item.data.title,
        sortDate,
        isUpdate: !!(updated && updated > published),
        url: `/${urlPrefix}/${item.id}`,
      };
    });

  return [
    ...normalize(code, 'code', 'code'),
    ...normalize(thoughts, 'cultivatedThoughtz', 'cultivated-thoughtz'),
    ...normalize(seeds, 'seeds', 'seeds'),
  ]
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .slice(0, limit);
}
