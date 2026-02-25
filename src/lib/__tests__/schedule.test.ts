import { describe, it, expect } from "vitest";
import { getWeekBounds, bucketByDayOfWeek, DAY_LABELS } from "../schedule";

describe("DAY_LABELS", () => {
  it("has 7 labels starting with Mon", () => {
    expect(DAY_LABELS).toHaveLength(7);
    expect(DAY_LABELS[0]).toBe("Mon");
    expect(DAY_LABELS[6]).toBe("Sun");
  });
});

describe("getWeekBounds", () => {
  it("returns Monday for a Wednesday anchor", () => {
    // 2024-01-10 is a Wednesday
    const anchor = new Date("2024-01-10T12:00:00");
    const { monday } = getWeekBounds(anchor);
    expect(monday.getDay()).toBe(1); // Monday
    expect(monday.getDate()).toBe(8);
  });

  it("returns Monday for a Monday anchor", () => {
    // 2024-01-08 is a Monday
    const anchor = new Date("2024-01-08T12:00:00");
    const { monday } = getWeekBounds(anchor);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(8);
  });

  it("returns previous Monday for a Saturday anchor", () => {
    // 2024-01-13 is a Saturday
    const anchor = new Date("2024-01-13T12:00:00");
    const { monday } = getWeekBounds(anchor);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(8);
  });

  it("returns previous Monday for a Sunday anchor", () => {
    // 2024-01-14 is a Sunday
    const anchor = new Date("2024-01-14T12:00:00");
    const { monday } = getWeekBounds(anchor);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(8);
  });

  it("sunday is 6 days after monday", () => {
    const anchor = new Date("2024-01-10T12:00:00");
    const { monday, sunday } = getWeekBounds(anchor);
    const diffDays = (sunday.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeCloseTo(6.9999, 2);
  });

  it("monday starts at midnight", () => {
    const anchor = new Date("2024-01-10T15:30:00");
    const { monday } = getWeekBounds(anchor);
    expect(monday.getHours()).toBe(0);
    expect(monday.getMinutes()).toBe(0);
    expect(monday.getSeconds()).toBe(0);
  });

  it("sunday ends at 23:59:59", () => {
    const anchor = new Date("2024-01-10T15:30:00");
    const { sunday } = getWeekBounds(anchor);
    expect(sunday.getHours()).toBe(23);
    expect(sunday.getMinutes()).toBe(59);
    expect(sunday.getSeconds()).toBe(59);
  });
});

describe("bucketByDayOfWeek", () => {
  it("returns 7 buckets", () => {
    const result = bucketByDayOfWeek([]);
    expect(result).toHaveLength(7);
  });

  it("puts Monday items in bucket 0", () => {
    // 2024-01-08 is a Monday
    const items = [{ scheduledDate: new Date("2024-01-08T10:00:00") }];
    const result = bucketByDayOfWeek(items);
    expect(result[0]).toHaveLength(1);
    expect(result[1]).toHaveLength(0);
  });

  it("puts Sunday items in bucket 6", () => {
    // 2024-01-14 is a Sunday
    const items = [{ scheduledDate: new Date("2024-01-14T10:00:00") }];
    const result = bucketByDayOfWeek(items);
    expect(result[6]).toHaveLength(1);
    expect(result[0]).toHaveLength(0);
  });

  it("puts Wednesday items in bucket 2", () => {
    // 2024-01-10 is a Wednesday
    const items = [{ scheduledDate: new Date("2024-01-10T10:00:00") }];
    const result = bucketByDayOfWeek(items);
    expect(result[2]).toHaveLength(1);
  });

  it("skips items with null scheduledDate", () => {
    const items = [{ scheduledDate: null }];
    const result = bucketByDayOfWeek(items);
    const totalItems = result.reduce((sum, bucket) => sum + bucket.length, 0);
    expect(totalItems).toBe(0);
  });

  it("handles string dates", () => {
    // 2024-01-12 is a Friday → bucket 4
    const items = [{ scheduledDate: "2024-01-12T10:00:00" }];
    const result = bucketByDayOfWeek(items);
    expect(result[4]).toHaveLength(1);
  });
});
