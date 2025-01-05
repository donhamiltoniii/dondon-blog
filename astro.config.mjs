// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  site: "https://dondon.dev",
  trailingSlash: "always",
});
