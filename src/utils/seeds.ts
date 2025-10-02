import { getCollection } from "astro:content";
import type { SeedAssets } from "../types";

type Options = {
    numberOfAssets: number | "all";
};

type GetSeedAssets = (options: Options) => Promise<SeedAssets>;

/**
 * Fetches seed assets sorted by publication date (newest first)
 * @param options - Configuration options
 * @param options.numberOfAssets - Number of assets to return, or "all" for all assets
 * @returns Promise resolving to filtered and sorted seed assets
 */
export const getSeedAssets: GetSeedAssets = async ({ numberOfAssets }) => {
    const seeds = await getCollection("seeds");
    const sorted = seeds.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

    if (numberOfAssets === "all") {
        return sorted;
    }

    return sorted.slice(0, numberOfAssets);
};

/**
 * Fetches all seed assets sorted by publication date (newest first)
 * @returns Promise resolving to all seed assets
 */
export async function getAllSeedAssets(): Promise<SeedAssets> {
    return await getSeedAssets({ numberOfAssets: "all" });
}