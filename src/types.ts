import type { CollectionEntry } from "astro:content";

export type ArticleAsset = CodeAsset | CultivatedThought | SeedAsset
export type ArticleAssetData = ArticleAsset['data']
export type ArticleAssets = ArticleAsset[]

export type CodeAsset = CollectionEntry<"code">
export type CodeAssets = CodeAsset[]

export type CultivatedThought = CollectionEntry<"cultivatedThoughtz">
export type CultivatedThoughtz = CultivatedThought[]

export type FoodAsset = CollectionEntry<"food">
export type FoodAssets = FoodAsset[]

export type SeedAsset = CollectionEntry<"seeds">
export type SeedAssetData = SeedAsset["data"]
export type SeedAssets = SeedAsset[]