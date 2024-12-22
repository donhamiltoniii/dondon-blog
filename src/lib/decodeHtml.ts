import pkg from "he";
const { unescape } = pkg;

export function decodeHtml(str: string) {
  return unescape(str);
}
