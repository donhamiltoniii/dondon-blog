import { describe, expect, it } from 'vitest';
import { kebabToTitle } from './kebabToTitle'; // adjust path

describe('kebabToTitle', () => {
    it('should convert simple kebab-case to Title Case', () => {
        expect(kebabToTitle('hello-world')).toBe('Hello World');
    });

    it('should convert single word', () => {
        expect(kebabToTitle('hello')).toBe('Hello');
    });

    it('should convert multi-word kebab-case', () => {
        expect(kebabToTitle('my-awesome-recipe')).toBe('My Awesome Recipe');
    });

    it('should handle all lowercase input', () => {
        expect(kebabToTitle('quick-easy-meal')).toBe('Quick Easy Meal');
    });

    it('should handle all uppercase input', () => {
        expect(kebabToTitle('LOUD-YELLING-WORDS')).toBe('Loud Yelling Words');
    });

    it('should handle mixed case input', () => {
        expect(kebabToTitle('MiXeD-CaSe-WoRdS')).toBe('Mixed Case Words');
    });

    it('should handle empty string', () => {
        expect(kebabToTitle('')).toBe('');
    });

    it('should handle string with no dashes', () => {
        expect(kebabToTitle('singleword')).toBe('Singleword');
    });

    it('should handle multiple consecutive dashes', () => {
        expect(kebabToTitle('hello---world')).toBe('Hello World');
    });

    it('should handle leading dash', () => {
        expect(kebabToTitle('-hello-world')).toBe('Hello World');
    });

    it('should handle trailing dash', () => {
        expect(kebabToTitle('hello-world-')).toBe('Hello World');
    });

    it('should handle single character words', () => {
        expect(kebabToTitle('a-b-c')).toBe('A B C');
    });

    it('should handle numbers in kebab-case', () => {
        expect(kebabToTitle('recipe-101-tips')).toBe('Recipe 101 Tips');
    });

    it('should handle special characters', () => {
        expect(kebabToTitle('hello-world!')).toBe('Hello World!');
    });

    it('should capitalize only first letter of each word', () => {
        expect(kebabToTitle('iPHONE-aPPLE')).toBe('Iphone Apple');
    });

    it('should handle very long strings', () => {
        const longString = 'this-is-a-very-long-kebab-case-string-with-many-words';
        const expected = 'This Is A Very Long Kebab Case String With Many Words';
        expect(kebabToTitle(longString)).toBe(expected);
    });

    it('should handle strings with underscores (edge case)', () => {
        expect(kebabToTitle('hello_world-foo-bar')).toBe('Hello_world Foo Bar');
    });

    it('should handle strings with spaces (edge case)', () => {
        expect(kebabToTitle('hello world-foo')).toBe('Hello world Foo');
    });

    it('should preserve numbers at start of words', () => {
        expect(kebabToTitle('3d-printing-guide')).toBe('3d Printing Guide');
    });

    it('should handle accented characters', () => {
        expect(kebabToTitle('café-résumé')).toBe('Café Résumé');
    });

    it('should handle category names from file paths', () => {
        // Common use case: converting category folder names
        expect(kebabToTitle('meal-prep')).toBe('Meal Prep');
        expect(kebabToTitle('quick-meals')).toBe('Quick Meals');
        expect(kebabToTitle('desserts')).toBe('Desserts');
    });

    it('should be idempotent when input is already Title Case with dashes', () => {
        expect(kebabToTitle('Hello-World')).toBe('Hello World');
    });
});