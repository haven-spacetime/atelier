import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates Tailwind conflicts", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats whole dollar amounts", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats cents", () => {
    expect(formatCurrency(42.5)).toBe("$42.50");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-250)).toBe("-$250.00");
  });

  it("formats large amounts with commas", () => {
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date("2024-03-15T12:00:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it("formats an ISO string", () => {
    const result = formatDate("2024-12-25T00:00:00Z");
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/2024/);
  });

  it("handles Date at epoch", () => {
    // new Date(0) in US timezones formats as Dec 31, 1969 (UTC midnight is previous day in PST/EST)
    const result = formatDate(new Date(0));
    expect(result).toMatch(/Dec 31, 1969|Jan 1, 1970/);
  });
});
