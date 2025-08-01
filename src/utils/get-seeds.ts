import { type CollectionEntry, getCollection } from "astro:content";


// Type definitions
export type Seed = CollectionEntry<'seeds'>;
export type Seeds = Seed[]

export type GetSeeds = () => Promise<Seeds>;

export const getSeeds: GetSeeds = async () =>
  await getCollection("seeds");

export const allSeeds = await getSeeds()