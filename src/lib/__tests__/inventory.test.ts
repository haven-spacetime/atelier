import { describe, it, expect } from "vitest";
import {
  getInventoryStatusIndex,
  getNextInventoryStatus,
  calcMarginPercent,
  calcProfit,
} from "../inventory";

describe("getInventoryStatusIndex", () => {
  it("returns 0 for AVAILABLE", () => {
    expect(getInventoryStatusIndex("AVAILABLE")).toBe(0);
  });

  it("returns 1 for PENDING", () => {
    expect(getInventoryStatusIndex("PENDING")).toBe(1);
  });

  it("returns 2 for SOLD", () => {
    expect(getInventoryStatusIndex("SOLD")).toBe(2);
  });

  it("returns -1 for unknown status", () => {
    expect(getInventoryStatusIndex("UNKNOWN")).toBe(-1);
  });
});

describe("getNextInventoryStatus", () => {
  it("advances AVAILABLE to PENDING", () => {
    expect(getNextInventoryStatus("AVAILABLE")).toBe("PENDING");
  });

  it("advances PENDING to SOLD", () => {
    expect(getNextInventoryStatus("PENDING")).toBe("SOLD");
  });

  it("returns null for SOLD (terminal state)", () => {
    expect(getNextInventoryStatus("SOLD")).toBeNull();
  });

  it("returns null for unknown status", () => {
    expect(getNextInventoryStatus("UNKNOWN")).toBeNull();
  });
});

describe("calcMarginPercent", () => {
  it("calculates positive margin", () => {
    expect(calcMarginPercent(120_000, 100_000)).toBe(20);
  });

  it("calculates negative margin", () => {
    expect(calcMarginPercent(80_000, 100_000)).toBe(-20);
  });

  it("returns null when askingPrice is null", () => {
    expect(calcMarginPercent(null, 100_000)).toBeNull();
  });

  it("returns null when costBasis is null", () => {
    expect(calcMarginPercent(120_000, null)).toBeNull();
  });

  it("returns null when both are null", () => {
    expect(calcMarginPercent(null, null)).toBeNull();
  });

  it("returns null when costBasis is zero", () => {
    expect(calcMarginPercent(120_000, 0)).toBeNull();
  });

  it("returns null when askingPrice is undefined", () => {
    expect(calcMarginPercent(undefined, 100_000)).toBeNull();
  });
});

describe("calcProfit", () => {
  it("calculates positive profit", () => {
    expect(calcProfit(150_000, 100_000)).toBe(50_000);
  });

  it("calculates negative profit (loss)", () => {
    expect(calcProfit(80_000, 100_000)).toBe(-20_000);
  });

  it("calculates zero profit", () => {
    expect(calcProfit(100_000, 100_000)).toBe(0);
  });

  it("returns null when askingPrice is null", () => {
    expect(calcProfit(null, 100_000)).toBeNull();
  });

  it("returns null when costBasis is null", () => {
    expect(calcProfit(150_000, null)).toBeNull();
  });

  it("returns null when both are null", () => {
    expect(calcProfit(null, null)).toBeNull();
  });

  it("returns null when costBasis is undefined", () => {
    expect(calcProfit(150_000, undefined)).toBeNull();
  });
});
