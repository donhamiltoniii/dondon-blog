import type { DataItemWithTitle } from "../types";


export function sortByTitle(a: DataItemWithTitle, b: DataItemWithTitle) {
    if (a.data.title > b.data.title) {
      return 1;
    }

    if (a.data.title < b.data.title) {
      return -1;
    }

    return 0;
}