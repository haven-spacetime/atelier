import { describe, it, expect } from "vitest";
import { getStatusIndex, getNextStatus, isActiveStatus, isPipelineStatus } from "../jobs";

describe("getStatusIndex", () => {
  it("returns 0 for INQUIRY", () => {
    expect(getStatusIndex("INQUIRY")).toBe(0);
  });

  it("returns 6 for INVOICED", () => {
    expect(getStatusIndex("INVOICED")).toBe(6);
  });

  it("returns 3 for IN_PROGRESS", () => {
    expect(getStatusIndex("IN_PROGRESS")).toBe(3);
  });

  it("returns -1 for unknown status", () => {
    expect(getStatusIndex("UNKNOWN")).toBe(-1);
  });
});

describe("getNextStatus", () => {
  it("advances INQUIRY to QUOTED", () => {
    expect(getNextStatus("INQUIRY")).toBe("QUOTED");
  });

  it("advances QUOTED to SCHEDULED", () => {
    expect(getNextStatus("QUOTED")).toBe("SCHEDULED");
  });

  it("advances IN_PROGRESS to QC", () => {
    expect(getNextStatus("IN_PROGRESS")).toBe("QC");
  });

  it("advances COMPLETE to INVOICED", () => {
    expect(getNextStatus("COMPLETE")).toBe("INVOICED");
  });

  it("returns null for INVOICED (terminal state)", () => {
    expect(getNextStatus("INVOICED")).toBeNull();
  });

  it("returns null for unknown status", () => {
    expect(getNextStatus("UNKNOWN")).toBeNull();
  });
});

describe("isActiveStatus", () => {
  it("returns true for IN_PROGRESS", () => {
    expect(isActiveStatus("IN_PROGRESS")).toBe(true);
  });

  it("returns true for QC", () => {
    expect(isActiveStatus("QC")).toBe(true);
  });

  it("returns false for INQUIRY", () => {
    expect(isActiveStatus("INQUIRY")).toBe(false);
  });

  it("returns false for COMPLETE", () => {
    expect(isActiveStatus("COMPLETE")).toBe(false);
  });

  it("returns false for INVOICED", () => {
    expect(isActiveStatus("INVOICED")).toBe(false);
  });
});

describe("isPipelineStatus", () => {
  it("returns true for INQUIRY", () => {
    expect(isPipelineStatus("INQUIRY")).toBe(true);
  });

  it("returns true for QUOTED", () => {
    expect(isPipelineStatus("QUOTED")).toBe(true);
  });

  it("returns false for SCHEDULED", () => {
    expect(isPipelineStatus("SCHEDULED")).toBe(false);
  });

  it("returns false for IN_PROGRESS", () => {
    expect(isPipelineStatus("IN_PROGRESS")).toBe(false);
  });

  it("returns false for COMPLETE", () => {
    expect(isPipelineStatus("COMPLETE")).toBe(false);
  });
});
