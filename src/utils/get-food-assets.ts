import { type CollectionEntry, getCollection } from "astro:content";

type GetRecipes = () => Promise<CollectionEntry<"food">[]>;

export const getFoodAssets: GetRecipes = async () =>
  (await getCollection("food")).sort((a, b) => {
    if (a.data.title > b.data.title) {
      return 1;
    }

    if (a.data.title < b.data.title) {
      return -1;
    }

    return 0;
  });

export async function getFoodAssetsByTag(tag: string) {
  const foodAssets = await getFoodAssets()
  return foodAssets.filter(fa => fa.data.tags.includes(tag))
}