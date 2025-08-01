import type { CollectionEntry } from "astro:content";

export type ArticleAsset = CodeAsset | SeedAsset
export type ArticleAssetData = ArticleAsset['data']
export type ArticleAssets = ArticleAsset[]

export type CodeAsset = CollectionEntry<"code">
export type CodeAssets = CodeAsset[]

export type FoodAsset = CollectionEntry<"food">
export type FoodAssets = FoodAsset[]

export type SeedAsset = CollectionEntry<"seeds">
export type SeedAssets = SeedAsset[]