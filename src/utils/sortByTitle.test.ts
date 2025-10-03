import { describe, expect, it } from 'vitest';
import type { DataItemWithTitle } from '../types';
import { sortByTitle } from './sortByTitle';

describe('sortByTitle', () => {
  it('should return 1 when first title comes after second alphabetically', () => {
    const itemA: DataItemWithTitle = {
      data: { title: 'Zebra' },
    } as DataItemWithTitle;

    const itemB: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    expect(sortByTitle(itemA, itemB)).toBe(1);
  });

  it('should return -1 when first title comes before second alphabetically', () => {
    const itemA: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    const itemB: DataItemWithTitle = {
      data: { title: 'Zebra' },
    } as DataItemWithTitle;

    expect(sortByTitle(itemA, itemB)).toBe(-1);
  });

  it('should return 0 when titles are identical', () => {
    const itemA: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    const itemB: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    expect(sortByTitle(itemA, itemB)).toBe(0);
  });

  it('should sort an array correctly when used with Array.sort()', () => {
    const items: DataItemWithTitle[] = [
      { data: { title: 'Zebra' } } as DataItemWithTitle,
      { data: { title: 'Apple' } } as DataItemWithTitle,
      { data: { title: 'Mango' } } as DataItemWithTitle,
      { data: { title: 'Banana' } } as DataItemWithTitle,
    ];

    const sorted = items.sort(sortByTitle);

    expect(sorted[0].data.title).toBe('Apple');
    expect(sorted[1].data.title).toBe('Banana');
    expect(sorted[2].data.title).toBe('Mango');
    expect(sorted[3].data.title).toBe('Zebra');
  });

  it('should handle case-sensitive sorting', () => {
    const itemA: DataItemWithTitle = {
      data: { title: 'apple' },
    } as DataItemWithTitle;

    const itemB: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    // lowercase 'a' comes after uppercase 'A' in ASCII
    expect(sortByTitle(itemA, itemB)).toBe(1);
  });

  it('should handle titles with numbers', () => {
    const items: DataItemWithTitle[] = [
      { data: { title: 'Recipe 10' } } as DataItemWithTitle,
      { data: { title: 'Recipe 2' } } as DataItemWithTitle,
      { data: { title: 'Recipe 1' } } as DataItemWithTitle,
    ];

    const sorted = items.sort(sortByTitle);

    // Note: This does lexicographic sorting, not natural number sorting
    expect(sorted[0].data.title).toBe('Recipe 1');
    expect(sorted[1].data.title).toBe('Recipe 10');
    expect(sorted[2].data.title).toBe('Recipe 2');
  });

  it('should handle empty strings', () => {
    const itemA: DataItemWithTitle = {
      data: { title: '' },
    } as DataItemWithTitle;

    const itemB: DataItemWithTitle = {
      data: { title: 'Apple' },
    } as DataItemWithTitle;

    expect(sortByTitle(itemA, itemB)).toBe(-1);
    expect(sortByTitle(itemB, itemA)).toBe(1);
  });
});
