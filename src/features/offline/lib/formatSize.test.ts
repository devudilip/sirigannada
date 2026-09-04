import { describe, expect, it } from "vitest";
import { formatBytes } from "./formatSize";

describe("formatBytes", () => {
  it("shows 0 KB for nothing cached", () => {
    expect(formatBytes(0)).toBe("0 KB");
    expect(formatBytes(-5)).toBe("0 KB");
  });

  it("shows one decimal under 10 KB/MB", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("rounds to whole numbers at 10 units and above", () => {
    expect(formatBytes(15 * 1024)).toBe("15 KB");
  });

  it("switches to MB above 1024 KB", () => {
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
    expect(formatBytes(20 * 1024 * 1024)).toBe("20 MB");
  });
});
