import pkg from 'he';
const { unescape } = pkg;

/**
 * Decodes HTML entities in a string
 * @param str - The string containing HTML entities to decode
 * @returns The decoded string with HTML entities converted to characters
 * @example
 * decodeHtml("&lt;div&gt;Hello&lt;/div&gt;") // returns "<div>Hello</div>"
 * decodeHtml("&#39;quoted&#39;") // returns "'quoted'"
 * decodeHtml("&amp;") // returns "&"
 */
export function decodeHtml(str: string): string {
  if (!str) {
    return str;
  }
  try {
    return unescape(str);
  } catch {
    return str;
  }
}
