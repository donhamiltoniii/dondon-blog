import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";
import { SITE_DESCRIPTION, SITE_TITLE } from "../constants";
import { getAllCodeAssets } from "../utils/get-code-assets";

const parser = new MarkdownIt();

export async function GET(context) {
  const codeAssets = await getAllCodeAssets();
  const items = codeAssets
    .filter(ca => ca.data.published)
    .map(ca => ({
      link: `/code/${ca.slug}/`,
      content: sanitize(parser.render(ca.body)),
      ...ca.data,
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    trailingSlash: false,
    items,
  });
}
