import { getCollection } from "astro:content";
import type { SeedAssets } from "../types";

type Options = {
    numberOfAssets: number | "all";
};
type GetSeedAssets = ({
    numberOfAssets,
}: Options) => Promise<SeedAssets>;

export const getSeedAssets: GetSeedAssets = async ({ numberOfAssets }) =>
    (await getCollection("seeds"))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .filter((_, index) => {
            if (numberOfAssets === "all") {
                return true;
            } else {
                return index < numberOfAssets;
            }
        });

export async function getAllSeedAssets() {
    return await getSeedAssets({ numberOfAssets: 'all' })
}
