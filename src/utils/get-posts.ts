import { CollectionEntry, getCollection } from "astro:content";

type Options = {
  numberOfPosts: number | "all";
};
type GetPosts = ({
  numberOfPosts,
}: Options) => Promise<CollectionEntry<"blog">[]>;

export const getPosts: GetPosts = async ({ numberOfPosts }) =>
  (await getCollection("blog"))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .filter((_, index) => {
      if (numberOfPosts === "all") {
        return true;
      } else {
        return index < numberOfPosts;
      }
    });
