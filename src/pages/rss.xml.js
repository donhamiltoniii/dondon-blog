import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";
import { SITE_DESCRIPTION, SITE_TITLE } from "../constants";

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("blog");
  const items = posts
    .filter((post) => post.data.published)
    .map((post) => ({
      link: `/blog/${post.slug}/`,
      content: sanitize(parser.render(post.body)),
      ...post.data,
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    trailingSlash: false,
    items,
  });
}
