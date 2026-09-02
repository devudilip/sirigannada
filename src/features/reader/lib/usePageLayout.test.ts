import { DEFAULT_SETTINGS, LINE_HEIGHT, PAGE_PADDING, pagePadding } from "../types";
import { computeGeometry } from "./usePageLayout";

describe("pagePadding", () => {
  it("keeps the previous normal defaults", () => {
    expect(pagePadding(360, "normal")).toBe(PAGE_PADDING.normal.narrow);
    expect(pagePadding(480, "normal")).toBe(PAGE_PADDING.normal.wide);
  });

  it("steps compact smaller and wide larger", () => {
    expect(pagePadding(360, "compact")).toBeLessThan(pagePadding(360, "normal"));
    expect(pagePadding(480, "wide")).toBeGreaterThan(pagePadding(480, "normal"));
  });
});

describe("computeGeometry margin", () => {
  it("applies compact padding on a narrow single page", () => {
    const g = computeGeometry({ width: 360, height: 640 }, "compact");
    expect(g.mode).toBe("single");
    expect(g.padding).toBe(PAGE_PADDING.compact.narrow);
  });

  it("applies wide padding on a wider single page", () => {
    const g = computeGeometry({ width: 480, height: 700 }, "wide");
    expect(g.mode).toBe("single");
    expect(g.padding).toBe(PAGE_PADDING.wide.wide);
  });
});

describe("line height steps", () => {
  it("uses named steps around the Kannada body token", () => {
    expect(LINE_HEIGHT.tight).toBe(1.6);
    expect(LINE_HEIGHT.normal).toBe(1.8);
    expect(LINE_HEIGHT.loose).toBe(2.0);
    expect(DEFAULT_SETTINGS.lineHeight).toBe("normal");
    expect(DEFAULT_SETTINGS.margin).toBe("normal");
  });
});
