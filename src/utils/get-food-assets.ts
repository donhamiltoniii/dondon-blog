import { type CollectionEntry, getCollection } from "astro:content";
import type { FoodAsset, FoodAssets } from "../types";
import { sortByTitle } from "./sort-by-title";

type GetRecipes = () => Promise<FoodAssets>;

export const getFoodAssets: GetRecipes = async () =>
  (await getCollection("food")).sort(sortByTitle);

export async function getFoodAssetsByTag(tag: string) {
  const foodAssets = await getFoodAssets()
  return foodAssets.filter(fa => fa.data.tags.includes(tag))
}