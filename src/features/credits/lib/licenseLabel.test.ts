import { describe, expect, it } from "vitest";
import { licenseLabelKey } from "./licenseLabel";

describe("licenseLabelKey", () => {
  it("maps every allowed licence to an i18n key", () => {
    expect(licenseLabelKey("public-domain")).toBe("licensePublicDomain");
    expect(licenseLabelKey("CC0-1.0")).toBe("licenseCC0");
    expect(licenseLabelKey("CC-BY-4.0")).toBe("licenseCCBY");
    expect(licenseLabelKey("CC-BY-SA-4.0")).toBe("licenseCCBYSA");
    expect(licenseLabelKey("ODbL-1.0")).toBe("licenseODbL");
  });
});
