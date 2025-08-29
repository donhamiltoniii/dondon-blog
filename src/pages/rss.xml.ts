import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import sanitize from "sanitize-html";
import { SITE_DESCRIPTION, SITE_TITLE } from "../constants";
import { getAllCodeAssets } from "../utils/get-code-assets";
import { getAllCultivatedThoughtz } from "../utils/get-cultivated-thoughtz";
import { getAllSeedAssets } from "../utils/get-seed-assets";

const parser = new MarkdownIt();

export async function GET(context: { site: any; }) {
  const codeAssets = await getAllCodeAssets()
  const codeAssetsFilteredArr = codeAssets.filter(ca => ca.data.published)
    .map(ca => ({
      link: `/code/${ca.slug}/`,
      content: sanitize(parser.render(ca.body)),
      ...ca.data,
    }));

  const cultivatedThoughtz = await getAllCultivatedThoughtz()
  const cultivatedThoughtzFilteredArr = cultivatedThoughtz
    .map(ct => ({
      link: `/cultivated-thoughtz/${ct.slug}/`,
      content: sanitize(parser.render(ct.body)),
      ...ct.data,
    }))

  const seeds = await getAllSeedAssets()
  const seedsFilteredArr = seeds
    .map(s => ({
      link: `/seeds/${s.slug}/`,
      content: sanitize(parser.render(s.body)),
      ...s.data,
    }))

  const items = [...codeAssetsFilteredArr, ...cultivatedThoughtzFilteredArr, ...seedsFilteredArr].sort((a, b) => {
    // Logic is for descending order - newest posts first
    if ((a.lastUpdate && b.lastUpdate && a.lastUpdate > b.lastUpdate)) {
      return -1
    }

    if ((a.lastUpdate && b.lastUpdate && a.lastUpdate < b.lastUpdate)) {
      return 1
    }

    // If for some reason there aren't lastUpdate values
    if (a.pubDate > b.pubDate) {
      return -1
    }

    if (a.pubDate < b.pubDate) {
      return 1
    }

    // If dates are equal
    return 0
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    trailingSlash: false,
    items,
  });
}
