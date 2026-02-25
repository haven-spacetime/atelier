import { describe, it, expect } from "vitest";
import {
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  JOB_TYPES,
  JOB_TYPE_COLORS,
  INVOICE_STATUSES,
  INVOICE_STATUS_COLORS,
  INVENTORY_STATUSES,
  INVENTORY_STATUS_COLORS,
  MARKETING_STATUSES,
  MARKETING_STATUS_COLORS,
  getJobStatusBadgeClass,
} from "../constants";

describe("JOB_STATUSES", () => {
  it("has 7 statuses", () => {
    expect(JOB_STATUSES).toHaveLength(7);
  });

  it("starts with INQUIRY and ends with INVOICED", () => {
    expect(JOB_STATUSES[0]).toBe("INQUIRY");
    expect(JOB_STATUSES[JOB_STATUSES.length - 1]).toBe("INVOICED");
  });

  it("every status has a label", () => {
    for (const status of JOB_STATUSES) {
      expect(JOB_STATUS_LABELS[status]).toBeDefined();
      expect(typeof JOB_STATUS_LABELS[status]).toBe("string");
    }
  });

  it("every status has colors (bg, text, dot)", () => {
    for (const status of JOB_STATUSES) {
      const colors = JOB_STATUS_COLORS[status];
      expect(colors).toBeDefined();
      expect(colors.bg).toBeDefined();
      expect(colors.text).toBeDefined();
      expect(colors.dot).toBeDefined();
    }
  });
});

describe("JOB_TYPES", () => {
  it("has 6 types", () => {
    expect(JOB_TYPES).toHaveLength(6);
  });

  it("every type has colors (bg, text)", () => {
    for (const type of JOB_TYPES) {
      const colors = JOB_TYPE_COLORS[type];
      expect(colors).toBeDefined();
      expect(colors.bg).toBeDefined();
      expect(colors.text).toBeDefined();
    }
  });
});

describe("INVOICE_STATUSES", () => {
  it("has 4 statuses", () => {
    expect(INVOICE_STATUSES).toHaveLength(4);
  });

  it("every status has a color string", () => {
    for (const status of INVOICE_STATUSES) {
      expect(typeof INVOICE_STATUS_COLORS[status]).toBe("string");
      expect(INVOICE_STATUS_COLORS[status].length).toBeGreaterThan(0);
    }
  });
});

describe("INVENTORY_STATUSES", () => {
  it("has 3 statuses", () => {
    expect(INVENTORY_STATUSES).toHaveLength(3);
  });

  it("every status has a color string", () => {
    for (const status of INVENTORY_STATUSES) {
      expect(typeof INVENTORY_STATUS_COLORS[status]).toBe("string");
    }
  });
});

describe("MARKETING_STATUSES", () => {
  it("has 3 statuses", () => {
    expect(MARKETING_STATUSES).toHaveLength(3);
  });

  it("every status has a color string", () => {
    for (const status of MARKETING_STATUSES) {
      expect(typeof MARKETING_STATUS_COLORS[status]).toBe("string");
    }
  });
});

describe("getJobStatusBadgeClass", () => {
  it("returns gold classes for IN_PROGRESS", () => {
    expect(getJobStatusBadgeClass("IN_PROGRESS")).toContain("C4A265");
  });

  it("returns warning classes for QC", () => {
    expect(getJobStatusBadgeClass("QC")).toContain("FF9800");
  });

  it("returns success classes for COMPLETE", () => {
    expect(getJobStatusBadgeClass("COMPLETE")).toContain("4CAF50");
  });

  it("returns default classes for unknown status", () => {
    expect(getJobStatusBadgeClass("UNKNOWN")).toContain("888888");
  });
});
