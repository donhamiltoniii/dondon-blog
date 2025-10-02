import type { ImageMetadata } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock astro:content
vi.mock('astro:content', () => ({
    getCollection: vi.fn(),
}));

describe('photo assets utilities', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });

    describe('getImagesForPhotoAssetFromGlob', () => {
        it('should throw error when assetId is empty string', async () => {
            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            await expect(
                getImagesForPhotoAssetFromGlob('', {})
            ).rejects.toThrow('assetId must be a non-empty string');
        });

        it('should throw error when assetId is whitespace only', async () => {
            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            await expect(
                getImagesForPhotoAssetFromGlob('   ', {})
            ).rejects.toThrow('assetId must be a non-empty string');
        });

        it('should return empty array when no images match assetId', async () => {
            const mockGlob = {
                '/src/content/photos/sunset-001.jpg': () =>
                    Promise.resolve({ default: {} as ImageMetadata }),
                '/src/content/photos/mountain-001.jpg': () =>
                    Promise.resolve({ default: {} as ImageMetadata }),
            };

            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            const result = await getImagesForPhotoAssetFromGlob('beach', mockGlob);

            expect(result).toEqual([]);
        });

        it('should return images matching the assetId', async () => {
            const mockImageMetadata1: ImageMetadata = {
                src: '/photos/sunset-001.jpg',
                width: 1920,
                height: 1080,
                format: 'jpg',
            };

            const mockImageMetadata2: ImageMetadata = {
                src: '/photos/sunset-002.jpg',
                width: 1920,
                height: 1080,
                format: 'jpg',
            };

            const mockGlob = {
                '/src/content/photos/sunset-001.jpg': () =>
                    Promise.resolve({ default: mockImageMetadata1 }),
                '/src/content/photos/sunset-002.jpg': () =>
                    Promise.resolve({ default: mockImageMetadata2 }),
                '/src/content/photos/mountain-001.jpg': () =>
                    Promise.resolve({ default: {} as ImageMetadata }),
            };

            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            const result = await getImagesForPhotoAssetFromGlob('sunset', mockGlob);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(mockImageMetadata1);
            expect(result[1]).toEqual(mockImageMetadata2);
        });

        it('should handle single matching image', async () => {
            const mockImageMetadata: ImageMetadata = {
                src: '/photos/portrait-123.jpg',
                width: 1080,
                height: 1920,
                format: 'jpg',
            };

            const mockGlob = {
                '/src/content/photos/portrait-123.jpg': () =>
                    Promise.resolve({ default: mockImageMetadata }),
                '/src/content/photos/landscape-456.jpg': () =>
                    Promise.resolve({ default: {} as ImageMetadata }),
            };

            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            const result = await getImagesForPhotoAssetFromGlob('portrait-123', mockGlob);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockImageMetadata);
        });

        it('should handle Promise rejection', async () => {
            const mockGlob = {
                '/src/content/photos/error-image.jpg': () =>
                    Promise.reject(new Error('Failed to load image')),
            };

            const { getImagesForPhotoAssetFromGlob } = await import('./photos');

            await expect(
                getImagesForPhotoAssetFromGlob('error-image', mockGlob)
            ).rejects.toThrow('Failed to load image');
        });
    });

    describe('getPhotoAssets', () => {
        it('should fetch all photo assets from collection', async () => {
            const mockPhotos = [
                {
                    id: 'photo1',
                    collection: 'photos',
                    data: { title: 'Sunset' },
                    slug: 'photo1',
                },
                {
                    id: 'photo2',
                    collection: 'photos',
                    data: { title: 'Mountain' },
                    slug: 'photo2',
                },
            ];

            const { getCollection } = await import('astro:content');
            vi.mocked(getCollection).mockResolvedValue(mockPhotos as any);

            const { getPhotoAssets } = await import('./photos');

            const result = await getPhotoAssets();

            expect(getCollection).toHaveBeenCalledWith('photos');
            expect(result).toEqual(mockPhotos);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no photos exist', async () => {
            const { getCollection } = await import('astro:content');
            vi.mocked(getCollection).mockResolvedValue([]);

            const { getPhotoAssets } = await import('./photos');

            const result = await getPhotoAssets();

            expect(result).toEqual([]);
        });

        it('should handle errors from getCollection', async () => {
            const { getCollection } = await import('astro:content');
            const error = new Error('Collection not found');
            vi.mocked(getCollection).mockRejectedValue(error);

            const { getPhotoAssets } = await import('./photos');

            await expect(getPhotoAssets()).rejects.toThrow('Collection not found');
        });
    });
});