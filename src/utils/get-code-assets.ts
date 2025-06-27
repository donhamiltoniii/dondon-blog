import { getCollection } from "astro:content";
import type { CodeAssets } from "../types";

type Options = {
  numberOfAssets: number | "all";
};
type GetCodeAssets = ({
  numberOfAssets,
}: Options) => Promise<CodeAssets>;

export const getCodeAssets: GetCodeAssets = async ({ numberOfAssets }) =>
  (await getCollection("code"))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .filter((_, index) => {
      if (numberOfAssets === "all") {
        return true;
      } else {
        return index < numberOfAssets;
      }
    });

export async function getAllCodeAssets() {
  return await getCodeAssets({ numberOfAssets: 'all' })
}
