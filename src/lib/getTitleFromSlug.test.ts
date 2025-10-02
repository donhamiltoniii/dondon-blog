import { describe, expect, it } from 'vitest';
import { getTitleFromSlug } from './getTitleFromSlug'; // adjust path

describe('getTitleFromSlug', () => {
    it('should extract last segment from simple slug', () => {
        expect(getTitleFromSlug('my-post')).toBe('my-post');
    });

    it('should extract last segment from nested slug', () => {
        expect(getTitleFromSlug('blog/posts/my-post')).toBe('my-post');
    });

    it('should handle empty string', () => {
        expect(getTitleFromSlug('')).toBe('');
    });

    it('should handle whitespace-only string', () => {
        expect(getTitleFromSlug('   ')).toBe('');
    });

    it('should handle slug with trailing slash', () => {
        expect(getTitleFromSlug('blog/posts/my-post/')).toBe('my-post');
    });

    it('should handle slug with multiple trailing slashes', () => {
        expect(getTitleFromSlug('blog/posts/my-post///')).toBe('my-post');
    });

    it('should handle slug with leading slash', () => {
        expect(getTitleFromSlug('/blog/posts/my-post')).toBe('my-post');
    });

    it('should handle slug with both leading and trailing slashes', () => {
        expect(getTitleFromSlug('/blog/posts/my-post/')).toBe('my-post');
    });

    it('should handle slug with consecutive slashes', () => {
        expect(getTitleFromSlug('blog//posts///my-post')).toBe('my-post');
    });

    it('should handle only slashes', () => {
        expect(getTitleFromSlug('///')).toBe('');
    });

    it('should handle single slash', () => {
        expect(getTitleFromSlug('/')).toBe('');
    });

    it('should filter out empty segments', () => {
        expect(getTitleFromSlug('/blog//posts///my-post//')).toBe('my-post');
    });

    it('should handle deeply nested paths with trailing slashes', () => {
        expect(getTitleFromSlug('a/b/c/d/e/f/final/')).toBe('final');
    });

    it('should handle mixed slash patterns', () => {
        expect(getTitleFromSlug('//blog/posts//my-post//')).toBe('my-post');
    });

    describe('real-world use cases with robust handling', () => {
        it('should handle file system paths with trailing slashes', () => {
            expect(getTitleFromSlug('src/content/food/desserts/chocolate-cake/'))
                .toBe('chocolate-cake');
        });

        it('should handle messy user input', () => {
            expect(getTitleFromSlug('  /blog//posts///my-post//  '))
                .toBe('my-post');
        });
    });
});