import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { TWA_PACKAGE } from "./twa";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const SHA256 = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

describe("Android app package", () => {
  it("matches apps/android/twa-manifest.json and the generated Gradle build", () => {
    const manifest = JSON.parse(read("apps/android/twa-manifest.json")) as { packageId: string; host: string };
    expect(manifest.packageId).toBe(TWA_PACKAGE);
    expect(manifest.host).toBe("www.sirigannada.in");
    expect(read("apps/android/app/build.gradle")).toContain(`applicationId "${TWA_PACKAGE}"`);
  });

  it("is the one Digital Asset Links trusts, with well-formed fingerprints", () => {
    const path = "public/.well-known/assetlinks.json";
    expect(existsSync(join(root, path))).toBe(true);
    const links = JSON.parse(read(path)) as Array<{
      relation: string[];
      target: { namespace: string; package_name: string; sha256_cert_fingerprints: string[] };
    }>;
    expect(links).toHaveLength(1);
    const link = links[0]!;
    expect(link.relation).toContain("delegate_permission/common.handle_all_urls");
    expect(link.target.namespace).toBe("android_app");
    expect(link.target.package_name).toBe(TWA_PACKAGE);
    expect(link.target.sha256_cert_fingerprints.length).toBeGreaterThan(0);
    for (const fp of link.target.sha256_cert_fingerprints) expect(fp).toMatch(SHA256);
  });
});
