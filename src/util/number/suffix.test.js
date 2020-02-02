// @flow

import {
  errMustBeNumber,
  errMustBeString,
  formatSuffix,
  parseSuffix,
} from "./suffix";

const k = n => n * 10 ** 3;
const m = n => k(k(n));
const g = n => k(m(n));

const any = ["K", "M", "G"];

describe("formatSuffix()", () => {
  test("should throw for wrong types", () => {
    expect(() => formatSuffix(any, (undefined: any))).toThrow(
      errMustBeNumber()
    );
    expect(() => formatSuffix(any, (null: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(any, ("abc": any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(any, ({}: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(any, (false: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(any, (Symbol(""): any))).toThrow(
      errMustBeNumber()
    );
    expect(() => formatSuffix(any, (Object: any))).toThrow(errMustBeNumber());
  });
  test("should return stringified special numbers", () => {
    expect(formatSuffix(any, NaN)).toBe("NaN");
    expect(formatSuffix(any, Infinity)).toBe("Infinity");
  });
  test("should return stringified ordinary numbers", () => {
    expect(formatSuffix(any, 0)).toBe("0");
    expect(formatSuffix(any, 555)).toBe("555");
    expect(formatSuffix(any, 999)).toBe("999");
    expect(formatSuffix(any, -1)).toBe("-1");
    expect(formatSuffix(any, -555)).toBe("-555");
    expect(formatSuffix(any, -999)).toBe("-999");
  });
  test('should append "K" suffix', () => {
    expect(formatSuffix(any, k(1))).toBe("1K");
    expect(formatSuffix(any, k(1.9))).toBe("1.9K");
    expect(formatSuffix(any, k(2))).toBe("2K");
    expect(formatSuffix(any, k(999))).toBe("999K");
    expect(formatSuffix(any, k(-1))).toBe("-1K");
    expect(formatSuffix(any, k(-1.9))).toBe("-1.9K");
    expect(formatSuffix(any, k(-2))).toBe("-2K");
    expect(formatSuffix(any, k(-999))).toBe("-999K");
  });
  test('should append "M" suffix', () => {
    expect(formatSuffix(any, m(1))).toBe("1M");
    expect(formatSuffix(any, m(1.9))).toBe("1.9M");
    expect(formatSuffix(any, m(2))).toBe("2M");
    expect(formatSuffix(any, m(999))).toBe("999M");
    expect(formatSuffix(any, m(-1))).toBe("-1M");
    expect(formatSuffix(any, m(-1.9))).toBe("-1.9M");
    expect(formatSuffix(any, m(-2))).toBe("-2M");
    expect(formatSuffix(any, m(-999))).toBe("-999M");
  });
  test('should append "G" suffix', () => {
    expect(formatSuffix(any, g(1))).toBe("1G");
    expect(formatSuffix(any, g(1.9))).toBe("1.9G");
    expect(formatSuffix(any, g(2))).toBe("2G");
    expect(formatSuffix(any, g(999))).toBe("999G");
    expect(formatSuffix(any, g(-1))).toBe("-1G");
    expect(formatSuffix(any, g(-1.9))).toBe("-1.9G");
    expect(formatSuffix(any, g(-2))).toBe("-2G");
    expect(formatSuffix(any, g(-999))).toBe("-999G");
  });
  test("should work for different suffixes", () => {
    expect(formatSuffix([], g(999))).toBe("999000000000");
    expect(formatSuffix(["K"], g(999))).toBe("999000000K");
    expect(formatSuffix(["K", "M"], g(999))).toBe("999000M");
  });
});

describe("parseSuffix()", () => {
  test("should throw for wrong types", () => {
    expect(() => parseSuffix(any, (undefined: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(any, (null: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(any, (999: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(any, ({}: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(any, (false: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(any, (Symbol(""): any))).toThrow(
      errMustBeString()
    );
    expect(() => parseSuffix(any, (Object: any))).toThrow(errMustBeString());
  });
  test("should return parsed simple numbers", () => {
    expect(parseSuffix(any, "0")).toBe(0);
    expect(parseSuffix(any, "123")).toBe(123);
    expect(parseSuffix(any, "1000")).toBe(1000);
    expect(parseSuffix(any, "-1000")).toBe(-1000);
  });
  test("should return NaN for invalid strings", () => {
    expect(parseSuffix(any, "")).toBe(NaN);
    expect(parseSuffix(any, "K")).toBe(NaN);
    expect(parseSuffix(any, "G")).toBe(NaN);
    expect(parseSuffix(any, "M")).toBe(NaN);
    expect(parseSuffix(any, "abc")).toBe(NaN);
    expect(parseSuffix(any, "123abc")).toBe(NaN);
  });
  test("should correctly append a suffix", () => {
    expect(parseSuffix(any, "0K")).toBe(0);
    expect(parseSuffix(any, "0M")).toBe(0);
    expect(parseSuffix(any, "0G")).toBe(0);
    expect(parseSuffix(any, "1K")).toBe(10 ** 3);
    expect(parseSuffix(any, "1M")).toBe(10 ** 6);
    expect(parseSuffix(any, "1G")).toBe(10 ** 9);
    expect(parseSuffix(any, "-1K")).toBe(-(10 ** 3));
    expect(parseSuffix(any, "-1M")).toBe(-(10 ** 6));
    expect(parseSuffix(any, "-1G")).toBe(-(10 ** 9));
    expect(parseSuffix(any, "1.253K")).toBe(1.253 * 10 ** 3);
    expect(parseSuffix(any, "1.253M")).toBe(1.253 * 10 ** 6);
    expect(parseSuffix(any, "1.253G")).toBe(1.253 * 10 ** 9);
    expect(parseSuffix(any, "-1.253K")).toBe(-1.253 * 10 ** 3);
    expect(parseSuffix(any, "-1.253M")).toBe(-1.253 * 10 ** 6);
    expect(parseSuffix(any, "-1.253G")).toBe(-1.253 * 10 ** 9);
  });
  test("should work for different suffixes", () => {
    expect(parseSuffix([], "1.253K")).toBe(NaN);
    expect(parseSuffix(["K"], "1.253M")).toBe(NaN);
    expect(parseSuffix(["K", "M"], "1.253G")).toBe(NaN);
  });
});
