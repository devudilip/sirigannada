import { LOW_MEMORY_GB, motionMode } from "./motionMode";

describe("motionMode", () => {
  it("keeps the 3D leaf on a capable device", () => {
    expect(motionMode({ reduceMotion: false, deviceMemory: 8 })).toBe("flip");
    expect(motionMode({ reduceMotion: false, deviceMemory: LOW_MEMORY_GB })).toBe("flip");
  });
  it("keeps the 3D leaf when the browser reports no memory hint", () => {
    expect(motionMode({ reduceMotion: false })).toBe("flip");
  });
  it("slides when the reader asked for less motion", () => {
    expect(motionMode({ reduceMotion: true, deviceMemory: 8 })).toBe("slide");
  });
  it("slides on a low-memory device", () => {
    expect(motionMode({ reduceMotion: false, deviceMemory: 1 })).toBe("slide");
    expect(motionMode({ reduceMotion: false, deviceMemory: 0.5 })).toBe("slide");
  });
});
