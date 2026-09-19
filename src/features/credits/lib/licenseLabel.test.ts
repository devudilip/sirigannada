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

  it("maps the older Commons CC versions used by cover photographs", () => {
    expect(licenseLabelKey("CC-BY-2.0")).toBe("licenseCCBY20");
    expect(licenseLabelKey("CC-BY-2.5")).toBe("licenseCCBY25");
    expect(licenseLabelKey("CC-BY-3.0")).toBe("licenseCCBY30");
    expect(licenseLabelKey("CC-BY-SA-2.0")).toBe("licenseCCBYSA20");
    expect(licenseLabelKey("CC-BY-SA-2.5")).toBe("licenseCCBYSA25");
    expect(licenseLabelKey("CC-BY-SA-3.0")).toBe("licenseCCBYSA30");
  });
});
