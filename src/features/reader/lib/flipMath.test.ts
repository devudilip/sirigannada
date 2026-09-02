import {
  canTurn,
  dragProgress,
  pagesAfterTurn,
  pagesInView,
  planLeaf,
  pageOfOffset,
  shade,
  slideOffset,
  stageWidthOf,
  viewCount,
  viewOfPage,
} from "./flipMath";

describe("views", () => {
  it("counts views per mode", () => {
    expect(viewCount(7, "single")).toBe(7);
    expect(viewCount(7, "spread")).toBe(4);
    expect(viewOfPage(5, "spread")).toBe(2);
  });
  it("lists pages in a spread, blank past the end", () => {
    expect(pagesInView(0, 7, "spread")).toEqual([0, 1]);
    expect(pagesInView(3, 7, "spread")).toEqual([6, -1]);
    expect(pagesInView(2, 7, "single")).toEqual([2, -1]);
  });
});

describe("planLeaf", () => {
  it("single forward pivots the current page on the left edge", () => {
    expect(planLeaf(2, "forward", 10, "single")).toMatchObject({ front: 2, under: [3, -1], side: "left", endAngle: -180 });
  });
  it("spread forward turns the right page whose back is the next left page", () => {
    expect(planLeaf(1, "forward", 10, "spread")).toMatchObject({ front: 3, back: 4, under: [2, 5], side: "right", endAngle: -180 });
  });
  it("spread backward turns the left page whose back is the previous right page", () => {
    expect(planLeaf(2, "backward", 10, "spread")).toMatchObject({ front: 4, back: 3, under: [2, 5], side: "left", endAngle: 180 });
  });
});

describe("guards and math", () => {
  it("blocks turning past either end", () => {
    expect(canTurn(0, "backward", 5, "single")).toBe(false);
    expect(canTurn(4, "forward", 5, "single")).toBe(false);
    expect(canTurn(2, "forward", 5, "spread")).toBe(false);
  });
  it("maps drag to progress with direction", () => {
    expect(dragProgress(-150, "forward", 300)).toBe(0.5);
    expect(dragProgress(150, "forward", 300)).toBe(0);
    expect(dragProgress(300, "backward", 300)).toBe(1);
  });
  it("shades most when edge-on", () => {
    expect(shade(0.5)).toBeGreaterThan(shade(0.1));
    expect(shade(0)).toBe(0);
  });
  it("finds page of an offset", () => {
    expect(pageOfOffset(0, 320)).toBe(0);
    expect(pageOfOffset(640, 320)).toBe(2);
  });
});

describe("plain slide path", () => {
  it("names the pages a turn lands on", () => {
    expect(pagesAfterTurn(1, "forward", 10, "spread")).toEqual([4, 5]);
    expect(pagesAfterTurn(2, "backward", 10, "spread")).toEqual([2, 3]);
    expect(pagesAfterTurn(2, "forward", 10, "single")).toEqual([3, -1]);
    expect(pagesAfterTurn(3, "forward", 9, "spread")).toEqual([8, -1]); // odd page count: last view is half blank
  });
  it("measures the stage across both pages of a spread", () => {
    expect(stageWidthOf({ mode: "spread", pageWidth: 320 })).toBe(640);
    expect(stageWidthOf({ mode: "single", pageWidth: 320 })).toBe(320);
  });
  it("slides the incoming sheet in from the side the turn comes from", () => {
    expect(slideOffset("forward", 0, 640)).toBe(640);
    expect(slideOffset("backward", 0, 640)).toBe(-640);
    expect(slideOffset("forward", 0.5, 640)).toBe(320);
    expect(slideOffset("forward", 1, 640)).toBe(0);
  });
  it("clamps progress outside [0, 1]", () => {
    expect(slideOffset("forward", 1.4, 640)).toBe(0);
    expect(slideOffset("forward", -0.4, 640)).toBe(640);
  });
});
