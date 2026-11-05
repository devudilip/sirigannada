import { describe, expect, it } from "vitest";
import { parentDestination } from "./parentDestination";

describe("parent navigation", () => {
  it.each([["/tools/numbers", "/tools"], ["/children/panchatantra/tale", "/children/panchatantra"], ["/children/picturebooks", "/children"], ["/proverbs", "/"], ["/tools/numbers.html", "/tools"], ["/", "/"]])("%s returns to %s without relying on browser history", (path, parent) => expect(parentDestination(path)).toBe(parent));
});
