import { type CollectionEntry, getCollection } from "astro:content";

type GetTutorials = () => Promise<CollectionEntry<"tutorials">[]>;

export const getTutorials: GetTutorials = async () =>
  await getCollection("tutorials");
