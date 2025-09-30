import { getCollection } from "astro:content";
import type { FoodAssetCategoryMap, FoodAssets } from "../types";
import { sortByTitle } from "./sort-by-title";

type GetRecipes = () => Promise<FoodAssets>;

export const getFoodAssets: GetRecipes = async () => {
  const foodAssets = (await getCollection("food")).sort(sortByTitle);

  return foodAssets
}

export const getMealPrepFoodAssets: GetRecipes = async () => {
  const foodAssets = (await getCollection("food")).sort(sortByTitle);

  const mealPrepFoodAssets = foodAssets.filter(fa => fa.filePath?.includes('meal-prep'))

  return mealPrepFoodAssets
}

export async function getFoodAssetsByCategory(): Promise<FoodAssetCategoryMap> {
  const foodAssets = getFoodAssets()

  const foodAssetRecord = (await foodAssets).reduce((record, currentAsset) => {
    const category = currentAsset.filePath?.split('/')[3]

    if (category) {
      if (!record[category]) {
        record[category] = []
      }

      record[category].push(currentAsset)
    }

    return record
  }, {} as FoodAssetCategoryMap)

  return foodAssetRecord
}

export async function getFoodAssetsByTag(tag: string) {
  const foodAssets = await getFoodAssets()
  return foodAssets.filter(fa => fa.data.tags.includes(tag))
}