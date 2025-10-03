import type { CollectionEntry } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the astro:content module
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('cultivated thoughts utilities', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  const createMockThought = (
    id: string,
    pubDate: Date,
    title?: string
  ): CollectionEntry<'cultivatedThoughtz'> =>
    ({
      id,
      collection: 'cultivatedThoughtz',
      data: {
        title: title || `Thought ${id}`,
        pubDate,
      },
      slug: id,
    }) as CollectionEntry<'cultivatedThoughtz'>;

  describe('getAllCultivatedThoughtz', () => {
    it('should return all thoughts sorted by pubDate (newest first)', async () => {
      const mockThoughts = [
        createMockThought('thought1', new Date('2024-01-01')),
        createMockThought('thought2', new Date('2024-03-01')),
        createMockThought('thought3', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(getCollection).toHaveBeenCalledWith('cultivatedThoughtz');
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('thought2'); // March (newest)
      expect(result[1].id).toBe('thought3'); // February
      expect(result[2].id).toBe('thought1'); // January (oldest)
    });

    it('should return empty array when no thoughts exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result).toEqual([]);
    });

    it('should handle single thought', async () => {
      const mockThought = createMockThought('single', new Date('2024-01-01'), 'Solo Thought');

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([mockThought]);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result).toHaveLength(1);
      expect(result[0].data.title).toBe('Solo Thought');
    });

    it('should handle thoughts with same pubDate', async () => {
      const samePubDate = new Date('2024-01-01');
      const mockThoughts = [
        createMockThought('thought1', samePubDate, 'First'),
        createMockThought('thought2', samePubDate, 'Second'),
        createMockThought('thought3', samePubDate, 'Third'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      // Should maintain stability in sort
      expect(result).toHaveLength(3);
      expect(result.every(t => t.data.pubDate.getTime() === samePubDate.getTime())).toBe(true);
    });

    it('should correctly sort with millisecond precision', async () => {
      const mockThoughts = [
        createMockThought('thought1', new Date('2024-01-01T10:00:00.100Z')),
        createMockThought('thought2', new Date('2024-01-01T10:00:00.300Z')),
        createMockThought('thought3', new Date('2024-01-01T10:00:00.200Z')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result[0].id).toBe('thought2'); // 300ms (newest)
      expect(result[1].id).toBe('thought3'); // 200ms
      expect(result[2].id).toBe('thought1'); // 100ms (oldest)
    });

    it('should handle errors from getCollection', async () => {
      const { getCollection } = await import('astro:content');
      const error = new Error('Collection not found');
      vi.mocked(getCollection).mockRejectedValue(error);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      await expect(getAllCultivatedThoughtz()).rejects.toThrow('Collection not found');
    });

    it('should sort by valueOf correctly for date objects', async () => {
      const mockThoughts = [
        createMockThought('thought1', new Date('2023-12-31')),
        createMockThought('thought2', new Date('2024-01-01')),
        createMockThought('thought3', new Date('2023-06-15')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result[0].id).toBe('thought2');
      expect(result[1].id).toBe('thought1');
      expect(result[2].id).toBe('thought3');
    });

    it('should handle large collections efficiently', async () => {
      const mockThoughts = Array.from({ length: 100 }, (_, i) =>
        createMockThought(
          `thought${i}`,
          new Date(2024, 0, 1 + i), // Sequential dates
          `Thought ${i}`
        )
      );

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result).toHaveLength(100);
      // First should be the most recent (day 100)
      expect(result[0].id).toBe('thought99');
      // Last should be the oldest (day 1)
      expect(result[99].id).toBe('thought0');
    });

    it('should return thoughts with correct structure', async () => {
      const mockThought = createMockThought('test-thought', new Date('2024-01-01'), 'Test Thought');

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([mockThought]);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('collection');
      expect(result[0]).toHaveProperty('data');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0].collection).toBe('cultivatedThoughtz');
      expect(result[0].data.title).toBe('Test Thought');
    });

    it('should handle thoughts from different years', async () => {
      const mockThoughts = [
        createMockThought('thought1', new Date('2022-06-15')),
        createMockThought('thought2', new Date('2024-01-01')),
        createMockThought('thought3', new Date('2023-12-31')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockThoughts);

      const { getAllCultivatedThoughtz } = await import('./cultivatedThoughtz');

      const result = await getAllCultivatedThoughtz();

      expect(result[0].data.pubDate.getUTCFullYear()).toBe(2024);
      expect(result[1].data.pubDate.getUTCFullYear()).toBe(2023);
      expect(result[2].data.pubDate.getUTCFullYear()).toBe(2022);
    });
  });
});
