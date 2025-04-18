import { type CollectionEntry, getCollection } from "astro:content";

type GetRecipes = () => Promise<CollectionEntry<"recipes">[]>;

export const getRecipes: GetRecipes = async () =>
  await getCollection("recipes");
