import { describe, it, expect } from "vitest";
import { extractTagsFromText } from "./tag.extractor";

describe("extractTag", () => {
    it("should extract tag from string", () => {
        const tag = extractTagsFromText("Hello #world");
        expect(tag).toEqual(["world"]);
    });

    it("should extract multiple tags from string", () => {
        const tags = extractTagsFromText("Hello #world #universe");
        expect(tags).toEqual(["world", "universe"]);
    });
});

