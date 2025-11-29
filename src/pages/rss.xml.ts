import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitize from 'sanitize-html';
import { SITE_DESCRIPTION, SITE_TITLE } from '../constants';
import { getAllCodeAssets } from '../utils/code';
import { getAllCultivatedThoughtz } from '../utils/cultivatedThoughtz';
import { getAllSeedAssets } from '../utils/seeds';

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const codeAssets = await getAllCodeAssets();
  const codeAssetsFilteredArr = codeAssets
    .filter(ca => ca.data.published)
    .map(ca => ({
      link: `/code/${ca.slug}/`,
      content: sanitize(parser.render(ca.body)),
      ...ca.data,
    }));

  const cultivatedThoughtz = await getAllCultivatedThoughtz();
  const cultivatedThoughtzFilteredArr = cultivatedThoughtz.map(ct => ({
    link: `/cultivated-thoughtz/${ct.slug}/`,
    content: sanitize(parser.render(ct.body)),
    ...ct.data,
  }));

  const seeds = await getAllSeedAssets();
  const seedsFilteredArr = seeds.map(s => ({
    link: `/seeds/${s.slug}/`,
    content: sanitize(parser.render(s.body)),
    ...s.data,
  }));

  const items = [
    ...codeAssetsFilteredArr,
    ...cultivatedThoughtzFilteredArr,
    ...seedsFilteredArr,
  ].sort((a, b) => {
    // Logic is for descending order - newest posts first
    if (a.updatedAt && b.updatedAt && a.updatedAt > b.updatedAt) {
      return -1;
    }
    if (a.updatedAt && b.updatedAt && a.updatedAt < b.updatedAt) {
      return 1;
    }
    // If for some reason there aren't updatedAt values
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    // If dates are equal
    return 0;
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? 'https://dondon.dev',
    trailingSlash: false,
    items,
  });
}
