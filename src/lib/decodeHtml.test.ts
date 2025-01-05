import { describe, expect, it } from "vitest";
import { decodeHtml } from "./decodeHtml";

describe("decodeHtml", () => {
  it("should replace encoded html values with ascii characters", () => {
    const expected = "@";
    const input = "&#64;";
    const result = decodeHtml(input);

    expect(expected).toBe(result);
  });
});
