import { getCollection } from "astro:content";
import type { CodeAssets } from "../types";

type Options = {
  numberOfAssets: number | "all";
};

type GetCodeAssets = (options: Options) => Promise<CodeAssets>;

/**
 * Fetches code assets sorted by publication date (newest first)
 * @param options - Configuration options
 * @param options.numberOfAssets - Number of assets to return, or "all" for all assets
 * @returns Promise resolving to filtered and sorted code assets
 */
export const getCodeAssets: GetCodeAssets = async ({ numberOfAssets }) => {
  const codeAssets = await getCollection("code");
  const sorted = codeAssets.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  if (numberOfAssets === "all") {
    return sorted;
  }

  return sorted.slice(0, numberOfAssets);
};

/**
 * Fetches all code assets sorted by publication date (newest first)
 * @returns Promise resolving to all code assets
 */
export async function getAllCodeAssets(): Promise<CodeAssets> {
  return await getCodeAssets({ numberOfAssets: "all" });
}