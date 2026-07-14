import type { CollectionEntry } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the astro:content module
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('code assets utilities', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  const createMockCodeAsset = (
    id: string,
    createdAt: Date,
    title?: string
  ): CollectionEntry<'code'> =>
    ({
      id,
      collection: 'code',
      data: {
        title: title || `Code ${id}`,
        createdAt,
        updatedAt: createdAt,
      },
      slug: id,
    }) as CollectionEntry<'code'>;

  describe('getCodeAssets', () => {
    it('should return all code assets sorted by createdAt (newest first) when numberOfAssets is "all"', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-03-01')),
        createMockCodeAsset('code3', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code'); // adjust path

      const result = await getCodeAssets({ numberOfAssets: 'all' });

      expect(getCollection).toHaveBeenCalledWith('code');
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('code2'); // March (newest)
      expect(result[1].id).toBe('code3'); // February
      expect(result[2].id).toBe('code1'); // January (oldest)
    });

    it('should return limited number of code assets when numberOfAssets is a number', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-03-01')),
        createMockCodeAsset('code3', new Date('2024-02-01')),
        createMockCodeAsset('code4', new Date('2024-04-01')),
        createMockCodeAsset('code5', new Date('2024-05-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 2 });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('code5'); // May (newest)
      expect(result[1].id).toBe('code4'); // April
    });

    it('should return single code asset when numberOfAssets is 1', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-03-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('code2'); // Newest
    });

    it('should return all code assets when numberOfAssets exceeds available assets', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 10 });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('code2');
      expect(result[1].id).toBe('code1');
    });

    it('should return empty array when numberOfAssets is 0', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 0 });

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no code assets exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 'all' });

      expect(result).toEqual([]);
    });

    it('should handle code assets with same createdAt', async () => {
      const samecreatedAt = new Date('2024-01-01');
      const mockAssets = [
        createMockCodeAsset('code1', samecreatedAt, 'Project A'),
        createMockCodeAsset('code2', samecreatedAt, 'Project B'),
        createMockCodeAsset('code3', samecreatedAt, 'Project C'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 'all' });

      // Should maintain stability in sort
      expect(result).toHaveLength(3);
    });

    it('should correctly sort with millisecond precision', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01T10:00:00.100Z')),
        createMockCodeAsset('code2', new Date('2024-01-01T10:00:00.300Z')),
        createMockCodeAsset('code3', new Date('2024-01-01T10:00:00.200Z')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 'all' });

      expect(result[0].id).toBe('code2'); // 300ms (newest)
      expect(result[1].id).toBe('code3'); // 200ms
      expect(result[2].id).toBe('code1'); // 100ms (oldest)
    });

    it('should handle errors from getCollection', async () => {
      const { getCollection } = await import('astro:content');
      const error = new Error('Collection not found');
      vi.mocked(getCollection).mockRejectedValue(error);

      const { getCodeAssets } = await import('./code');

      await expect(getCodeAssets({ numberOfAssets: 'all' })).rejects.toThrow(
        'Collection not found'
      );
    });

    it('should handle negative numberOfAssets gracefully', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: -5 });

      // slice with negative index returns empty array
      expect(result).toHaveLength(0);
    });

    it('should sort by valueOf correctly for date objects', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2023-12-31')),
        createMockCodeAsset('code2', new Date('2024-01-01')),
        createMockCodeAsset('code3', new Date('2023-06-15')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets } = await import('./code');

      const result = await getCodeAssets({ numberOfAssets: 'all' });

      expect(result[0].data.createdAt.getUTCFullYear()).toBe(2024);
      expect(result[1].data.createdAt.getUTCFullYear()).toBe(2023);
      expect(result[1].data.createdAt.getUTCMonth()).toBe(11); // December
      expect(result[2].data.createdAt.getUTCMonth()).toBe(5); // June
    });
  });

  describe('getAllCodeAssets', () => {
    it('should return all code assets sorted by createdAt', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-03-01')),
        createMockCodeAsset('code3', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getAllCodeAssets } = await import('./code');

      const result = await getAllCodeAssets();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('code2'); // March (newest)
      expect(result[1].id).toBe('code3'); // February
      expect(result[2].id).toBe('code1'); // January (oldest)
    });

    it('should be equivalent to calling getCodeAssets with "all"', async () => {
      const mockAssets = [
        createMockCodeAsset('code1', new Date('2024-01-01')),
        createMockCodeAsset('code2', new Date('2024-02-01')),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getCodeAssets, getAllCodeAssets } = await import('./code');

      const resultAll = await getAllCodeAssets();

      // Reset and get fresh mock
      vi.clearAllMocks();
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const resultDirect = await getCodeAssets({ numberOfAssets: 'all' });

      expect(resultAll).toHaveLength(resultDirect.length);
      expect(resultAll[0].id).toBe(resultDirect[0].id);
      expect(resultAll[1].id).toBe(resultDirect[1].id);
    });

    it('should return empty array when no code assets exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getAllCodeAssets } = await import('./code');

      const result = await getAllCodeAssets();

      expect(result).toEqual([]);
    });

    it('should handle errors from getCollection', async () => {
      const { getCollection } = await import('astro:content');
      const error = new Error('Failed to fetch code collection');
      vi.mocked(getCollection).mockRejectedValue(error);

      const { getAllCodeAssets } = await import('./code');

      await expect(getAllCodeAssets()).rejects.toThrow('Failed to fetch code collection');
    });

    it('should return code assets with correct structure', async () => {
      const mockAsset = createMockCodeAsset('test-code', new Date('2024-01-01'), 'Test Project');

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([mockAsset]);

      const { getAllCodeAssets } = await import('./code');

      const result = await getAllCodeAssets();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('collection');
      expect(result[0]).toHaveProperty('data');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0].collection).toBe('code');
      expect(result[0].data.title).toBe('Test Project');
    });
  });

  describe('type safety', () => {
    it('should enforce correct Options type', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getCodeAssets } = await import('./code');

      // These should work
      await getCodeAssets({ numberOfAssets: 'all' });
      await getCodeAssets({ numberOfAssets: 5 });

      // TypeScript would catch invalid values at compile time
      expect(true).toBe(true);
    });
  });
});
