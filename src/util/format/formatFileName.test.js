// @flow

import { formatFileName } from "./formatFileName";

describe("formatFileName()", () => {
  test("empty string", () => {
    expect(formatFileName("")).toBe("");
  });

  test("uri", () => {
    const uri =
      "http://192.168.1.7:19001/src/App.bundle?platform=android&dev=true&minify=false&hot=false&assetPlugin=%2Fhome%2Fuser%2Fp%2Flango-app%2Fnode_modules%2Fexpo%2Ftools%2FhashAssetFiles.js";
    expect(formatFileName(uri)).toBe("App.bundle");
  });

  test("file system path", () => {
    const path = "/home/user/p/lango-app/script.js";
    expect(formatFileName(path)).toBe("script.js");
  });
});
