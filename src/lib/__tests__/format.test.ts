import { describe, it, expect } from "vitest";
import { formatStatus, parseJsonArray } from "../format";

describe("formatStatus", () => {
  it("replaces underscores with spaces", () => {
    expect(formatStatus("IN_PROGRESS")).toBe("IN PROGRESS");
  });

  it("returns single-word statuses unchanged", () => {
    expect(formatStatus("INQUIRY")).toBe("INQUIRY");
  });

  it("handles empty string", () => {
    expect(formatStatus("")).toBe("");
  });

  it("handles multiple underscores", () => {
    expect(formatStatus("A_B_C")).toBe("A B C");
  });
});

describe("parseJsonArray", () => {
  it("parses a valid JSON array of strings", () => {
    expect(parseJsonArray('["a","b","c"]')).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for empty JSON array", () => {
    expect(parseJsonArray("[]")).toEqual([]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseJsonArray("not json")).toEqual([]);
  });

  it("returns empty array for JSON object (non-array)", () => {
    expect(parseJsonArray('{"key": "value"}')).toEqual([]);
  });

  it("returns empty array for JSON string (non-array)", () => {
    expect(parseJsonArray('"hello"')).toEqual([]);
  });

  it("returns empty array for JSON number (non-array)", () => {
    expect(parseJsonArray("42")).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseJsonArray("")).toEqual([]);
  });

  it("returns empty array for JSON null", () => {
    expect(parseJsonArray("null")).toEqual([]);
  });

  it("parses array of numbers", () => {
    expect(parseJsonArray<number>("[1,2,3]")).toEqual([1, 2, 3]);
  });
});
