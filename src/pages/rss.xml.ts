import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitize from 'sanitize-html';
import { SITE_DESCRIPTION, SITE_TITLE } from '../constants';
import { getAllCodeAssets } from '../utils/code';
import { getAllCultivatedThoughtz } from '../utils/cultivatedThoughtz';
import { getAllSeedAssets } from '../utils/seeds';

const parser = new MarkdownIt();

const renderBody = (body: string | undefined) => sanitize(parser.render(body ?? ''));

export async function GET(context: APIContext) {
  const codeAssets = await getAllCodeAssets();
  const codeAssetsFilteredArr = codeAssets
    .filter(ca => ca.data.published)
    .map(ca => ({
      link: `/code/${ca.id}/`,
      content: renderBody(ca.body),
      ...ca.data,
    }));

  const cultivatedThoughtz = await getAllCultivatedThoughtz();
  const cultivatedThoughtzFilteredArr = cultivatedThoughtz.map(ct => ({
    link: `/cultivated-thoughtz/${ct.id}/`,
    content: renderBody(ct.body),
    ...ct.data,
  }));

  const seeds = await getAllSeedAssets();
  const seedsFilteredArr = seeds.map(s => ({
    link: `/seeds/${s.id}/`,
    content: renderBody(s.body),
    ...s.data,
  }));

  const items = [
    ...codeAssetsFilteredArr,
    ...cultivatedThoughtzFilteredArr,
    ...seedsFilteredArr,
  ].sort((a, b) => {
    const aDate = a.updatedAt ?? a.createdAt;
    const bDate = b.updatedAt ?? b.createdAt;
    return bDate.getTime() - aDate.getTime();
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? 'https://dondon.dev',
    trailingSlash: false,
    items,
  });
}
