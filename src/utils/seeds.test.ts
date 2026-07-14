import type { CollectionEntry } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the astro:content module
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('seed assets utilities', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  const createMockSeed = (id: string, createdAt: Date): CollectionEntry<'seeds'> =>
    ({
      id,
      collection: 'seeds',
      data: {
        title: `Seed ${id}`,
        createdAt,
        updatedAt: createdAt,
      },
      slug: id,
    }) as CollectionEntry<'seeds'>;

  describe('getSeedAssets', () => {
    it('should return all seeds sorted by createdAt (newest first) when numberOfAssets is "all"', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-03-01')),
        createMockSeed('seed3', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds'); // adjust path

      const result = await getSeedAssets({ numberOfAssets: 'all' });

      expect(getCollection).toHaveBeenCalledWith('seeds');
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('seed2'); // March (newest)
      expect(result[1].id).toBe('seed3'); // February
      expect(result[2].id).toBe('seed1'); // January (oldest)
    });

    it('should return limited number of seeds when numberOfAssets is a number', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-03-01')),
        createMockSeed('seed3', new Date('2024-02-01')),
        createMockSeed('seed4', new Date('2024-04-01')),
        createMockSeed('seed5', new Date('2024-05-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 2 });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('seed5'); // May (newest)
      expect(result[1].id).toBe('seed4'); // April
    });

    it('should return single seed when numberOfAssets is 1', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-03-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('seed2'); // Newest
    });

    it('should return all seeds when numberOfAssets exceeds available seeds', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 10 });

      expect(result).toHaveLength(2);
    });

    it('should return empty array when numberOfAssets is 0', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 0 });

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no seeds exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 'all' });

      expect(result).toEqual([]);
    });

    it('should handle seeds with same createdAt', async () => {
      const samecreatedAt = new Date('2024-01-01');
      const mockSeeds = [
        createMockSeed('seed1', samecreatedAt),
        createMockSeed('seed2', samecreatedAt),
        createMockSeed('seed3', samecreatedAt),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 'all' });

      // Should maintain stability in sort
      expect(result).toHaveLength(3);
    });

    it('should correctly sort with millisecond precision', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01T10:00:00.100Z')),
        createMockSeed('seed2', new Date('2024-01-01T10:00:00.300Z')),
        createMockSeed('seed3', new Date('2024-01-01T10:00:00.200Z')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets } = await import('./seeds');

      const result = await getSeedAssets({ numberOfAssets: 'all' });

      expect(result[0].id).toBe('seed2'); // 300ms (newest)
      expect(result[1].id).toBe('seed3'); // 200ms
      expect(result[2].id).toBe('seed1'); // 100ms (oldest)
    });

    it('should handle errors from getCollection', async () => {
      const { getCollection } = await import('astro:content');
      const error = new Error('Collection not found');
      vi.mocked(getCollection).mockRejectedValue(error);

      const { getSeedAssets } = await import('./seeds');

      await expect(getSeedAssets({ numberOfAssets: 'all' })).rejects.toThrow(
        'Collection not found'
      );
    });
  });

  describe('getAllSeedAssets', () => {
    it('should return all seeds sorted by createdAt', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-03-01')),
        createMockSeed('seed3', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getAllSeedAssets } = await import('./seeds');

      const result = await getAllSeedAssets();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('seed2');
      expect(result[1].id).toBe('seed3');
      expect(result[2].id).toBe('seed1');
    });

    it('should be equivalent to calling getSeedAssets with "all"', async () => {
      const mockSeeds = [
        createMockSeed('seed1', new Date('2024-01-01')),
        createMockSeed('seed2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const { getSeedAssets, getAllSeedAssets } = await import('./seeds');

      const resultAll = await getAllSeedAssets();

      // Reset and get fresh mock
      vi.clearAllMocks();
      vi.mocked(getCollection).mockResolvedValue(mockSeeds);

      const resultDirect = await getSeedAssets({ numberOfAssets: 'all' });

      expect(resultAll).toHaveLength(resultDirect.length);
      expect(resultAll[0].id).toBe(resultDirect[0].id);
    });

    it('should return empty array when no seeds exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getAllSeedAssets } = await import('./seeds');

      const result = await getAllSeedAssets();

      expect(result).toEqual([]);
    });
  });
});
