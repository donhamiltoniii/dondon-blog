import { type CollectionEntry, getCollection } from "astro:content";

type GetRecipes = () => Promise<CollectionEntry<"recipes">[]>;

export const getRecipes: GetRecipes = async () =>
  (await getCollection("recipes")).sort((a, b) => {
    if (a.data.title > b.data.title) {
      return 1;
    }

    if (a.data.title < b.data.title) {
      return -1;
    }

    return 0;
  });
