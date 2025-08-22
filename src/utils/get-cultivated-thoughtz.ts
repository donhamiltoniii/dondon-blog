import { getCollection } from "astro:content";
import type { CultivatedThoughtz } from "../types";

type GetCultivatedThoughtz = () => Promise<CultivatedThoughtz>;

export const getAllCultivatedThoughtz: GetCultivatedThoughtz = async () =>
    (await getCollection("cultivatedThoughtz"))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
