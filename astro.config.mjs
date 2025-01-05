// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./plugins/remark-modified-time.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkModifiedTime],
    }),
    sitemap(),
  ],
  site: "https://dondon.dev",
  trailingSlash: "always",
});
