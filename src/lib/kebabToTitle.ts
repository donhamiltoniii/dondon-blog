/**
 * Converts a kebab-case string to Title Case
 * @param kebabString - The kebab-case string to convert (e.g., "hello-world")
 * @returns The converted Title Case string (e.g., "Hello World")
 * @example
 * kebabToTitle("my-awesome-recipe") // returns "My Awesome Recipe"
 * kebabToTitle("quick-meal") // returns "Quick Meal"
 */
export function kebabToTitle(kebabString: string): string {
  if (!kebabString || kebabString.trim() === '') {
    return '';
  }

  return kebabString
    .split('-')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
