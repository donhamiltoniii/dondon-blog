import type { CollectionEntry } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

vi.mock('./sort-by-title', () => ({
  sortByTitle: vi.fn((a, b) => {
    if (a.data.title > b.data.title) return 1;
    if (a.data.title < b.data.title) return -1;
    return 0;
  }),
}));

describe('food assets utilities', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  const createMockFoodAsset = (
    id: string,
    title: string,
    filePath?: string,
    tags: string[] = []
  ): CollectionEntry<'food'> =>
    ({
      id,
      collection: 'food',
      data: {
        title,
        tags,
      },
      slug: id,
      filePath,
    }) as CollectionEntry<'food'>;

  describe('getFoodAssets', () => {
    it('should fetch and sort all food assets by title', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Zebra Cake'),
        createMockFoodAsset('recipe2', 'Apple Pie'),
        createMockFoodAsset('recipe3', 'Banana Bread'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssets } = await import('./food'); // adjust path

      const result = await getFoodAssets();

      expect(getCollection).toHaveBeenCalledWith('food');
      expect(result).toHaveLength(3);
      // Verify sorting was applied
      expect(result[0].data.title).toBe('Apple Pie');
      expect(result[1].data.title).toBe('Banana Bread');
      expect(result[2].data.title).toBe('Zebra Cake');
    });

    it('should return empty array when no food assets exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getFoodAssets } = await import('./food');

      const result = await getFoodAssets();

      expect(result).toEqual([]);
    });

    it('should handle errors from getCollection', async () => {
      const { getCollection } = await import('astro:content');
      const error = new Error('Collection error');
      vi.mocked(getCollection).mockRejectedValue(error);

      const { getFoodAssets } = await import('./food');

      await expect(getFoodAssets()).rejects.toThrow('Collection error');
    });
  });

  describe('getMealPrepFoodAssets', () => {
    it('should return only meal prep food assets', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Meal Prep Bowl', 'src/content/food/meal-prep/bowl.md'),
        createMockFoodAsset('recipe2', 'Regular Recipe', 'src/content/food/dinners/pasta.md'),
        createMockFoodAsset('recipe3', 'Meal Prep Salad', 'src/content/food/meal-prep/salad.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getMealPrepFoodAssets } = await import('./food');

      const result = await getMealPrepFoodAssets();

      expect(result).toHaveLength(2);
      expect(result[0].data.title).toBe('Meal Prep Bowl');
      expect(result[1].data.title).toBe('Meal Prep Salad');
      expect(result.every(r => r.filePath?.includes('meal-prep'))).toBe(true);
    });

    it('should return empty array when no meal prep assets exist', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Regular Recipe', 'src/content/food/dinners/pasta.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getMealPrepFoodAssets } = await import('./food');

      const result = await getMealPrepFoodAssets();

      expect(result).toEqual([]);
    });

    it('should handle assets without filePath', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'No Path Recipe', undefined),
        createMockFoodAsset('recipe2', 'Meal Prep Recipe', 'src/content/food/meal-prep/recipe.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getMealPrepFoodAssets } = await import('./food');

      const result = await getMealPrepFoodAssets();

      expect(result).toHaveLength(1);
      expect(result[0].data.title).toBe('Meal Prep Recipe');
    });

    it('should sort meal prep assets by title', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Zucchini Bowl', 'src/content/food/meal-prep/zucchini.md'),
        createMockFoodAsset('recipe2', 'Apple Salad', 'src/content/food/meal-prep/apple.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getMealPrepFoodAssets } = await import('./food');

      const result = await getMealPrepFoodAssets();

      expect(result[0].data.title).toBe('Apple Salad');
      expect(result[1].data.title).toBe('Zucchini Bowl');
    });
  });

  describe('getFoodAssetsByCategory', () => {
    it('should group food assets by category', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Pasta', 'src/content/food/dinners/pasta.md'),
        createMockFoodAsset('recipe2', 'Salad', 'src/content/food/appetizers/salad.md'),
        createMockFoodAsset('recipe3', 'Steak', 'src/content/food/dinners/steak.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByCategory } = await import('./food');

      const result = await getFoodAssetsByCategory();

      expect(result).toHaveProperty('dinners');
      expect(result).toHaveProperty('appetizers');
      expect(result.dinners).toHaveLength(2);
      expect(result.appetizers).toHaveLength(1);
      expect(result.dinners[0].data.title).toBe('Pasta');
      expect(result.dinners[1].data.title).toBe('Steak');
    });

    it('should handle assets without filePath', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'No Path', undefined),
        createMockFoodAsset('recipe2', 'With Path', 'src/content/food/desserts/cake.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByCategory } = await import('./food');

      const result = await getFoodAssetsByCategory();

      expect(result).toHaveProperty('desserts');
      expect(result.desserts).toHaveLength(1);
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('should return empty object when no food assets exist', async () => {
      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getFoodAssetsByCategory } = await import('./food');

      const result = await getFoodAssetsByCategory();

      expect(result).toEqual({});
    });

    it('should handle multiple assets in same category', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Cake', 'src/content/food/desserts/cake.md'),
        createMockFoodAsset('recipe2', 'Pie', 'src/content/food/desserts/pie.md'),
        createMockFoodAsset('recipe3', 'Cookies', 'src/content/food/desserts/cookies.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByCategory } = await import('./food');

      const result = await getFoodAssetsByCategory();

      expect(result.desserts).toHaveLength(3);
      expect(result.desserts.map(a => a.data.title)).toEqual(['Cake', 'Cookies', 'Pie']);
    });

    it('should handle malformed file paths', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Short Path', 'src/food.md'),
        createMockFoodAsset('recipe2', 'Normal Path', 'src/content/food/dinners/normal.md'),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByCategory } = await import('./food');

      const result = await getFoodAssetsByCategory();

      // Short path should be filtered out (no category at index 3)
      expect(result).toHaveProperty('dinners');
      expect(result.dinners).toHaveLength(1);
    });
  });

  describe('getFoodAssetsByTag', () => {
    it('should return assets with specified tag', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Vegan Pasta', undefined, ['vegan', 'italian']),
        createMockFoodAsset('recipe2', 'Beef Stew', undefined, ['meat']),
        createMockFoodAsset('recipe3', 'Vegan Salad', undefined, ['vegan', 'healthy']),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByTag } = await import('./food');

      const result = await getFoodAssetsByTag('vegan');

      expect(result).toHaveLength(2);
      expect(result[0].data.title).toBe('Vegan Pasta');
      expect(result[1].data.title).toBe('Vegan Salad');
    });

    it('should return empty array when no assets have the tag', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'Pasta', undefined, ['italian']),
        createMockFoodAsset('recipe2', 'Stew', undefined, ['comfort-food']),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByTag } = await import('./food');

      const result = await getFoodAssetsByTag('mexican');

      expect(result).toEqual([]);
    });

    it('should handle assets with no tags', async () => {
      const mockAssets = [
        createMockFoodAsset('recipe1', 'No Tags', undefined, []),
        createMockFoodAsset('recipe2', 'With Tag', undefined, ['healthy']),
      ];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByTag } = await import('./food');

      const result = await getFoodAssetsByTag('healthy');

      expect(result).toHaveLength(1);
      expect(result[0].data.title).toBe('With Tag');
    });

    it('should be case-sensitive for tags', async () => {
      const mockAssets = [createMockFoodAsset('recipe1', 'Recipe', undefined, ['Vegan'])];

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockAssets);

      const { getFoodAssetsByTag } = await import('./food');

      const resultLower = await getFoodAssetsByTag('vegan');
      const resultUpper = await getFoodAssetsByTag('Vegan');

      expect(resultLower).toHaveLength(0);
      expect(resultUpper).toHaveLength(1);
    });
  });

  describe('getSortedRecipeSectionEntries', () => {
    it('should sort entries alphabetically by category name', async () => {
      const mockRecipes = {
        zebra: [createMockFoodAsset('1', 'Recipe 1')],
        apple: [createMockFoodAsset('2', 'Recipe 2')],
        mango: [createMockFoodAsset('3', 'Recipe 3')],
      };

      const { getSortedRecipeSectionEntries } = await import('./food');

      const result = getSortedRecipeSectionEntries(mockRecipes);

      expect(result).toHaveLength(3);
      expect(result[0][0]).toBe('apple');
      expect(result[1][0]).toBe('mango');
      expect(result[2][0]).toBe('zebra');
    });

    it('should handle empty object', async () => {
      const { getSortedRecipeSectionEntries } = await import('./food');

      const result = getSortedRecipeSectionEntries({});

      expect(result).toEqual([]);
    });

    it('should handle single entry', async () => {
      const mockRecipes = {
        desserts: [createMockFoodAsset('1', 'Cake')],
      };

      const { getSortedRecipeSectionEntries } = await import('./food');

      const result = getSortedRecipeSectionEntries(mockRecipes);

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe('desserts');
      expect(result[0][1]).toHaveLength(1);
    });

    it('should preserve array contents while sorting keys', async () => {
      const mockRecipes = {
        dinners: [createMockFoodAsset('1', 'Pasta'), createMockFoodAsset('2', 'Steak')],
        appetizers: [createMockFoodAsset('3', 'Salad')],
      };

      const { getSortedRecipeSectionEntries } = await import('./food');

      const result = getSortedRecipeSectionEntries(mockRecipes);

      expect(result[0][0]).toBe('appetizers');
      expect(result[0][1]).toHaveLength(1);
      expect(result[1][0]).toBe('dinners');
      expect(result[1][1]).toHaveLength(2);
    });

    it('should handle categories with special characters', async () => {
      const mockRecipes = {
        'meal-prep': [createMockFoodAsset('1', 'Bowl')],
        quick_meals: [createMockFoodAsset('2', 'Sandwich')],
        'comfort food': [createMockFoodAsset('3', 'Mac & Cheese')],
      };

      const { getSortedRecipeSectionEntries } = await import('./food');

      const result = getSortedRecipeSectionEntries(mockRecipes);

      expect(result).toHaveLength(3);
      // Should use locale-aware sorting
      expect(result.map(([cat]) => cat)).toEqual(['comfort food', 'meal-prep', 'quick_meals']);
    });
  });
});
