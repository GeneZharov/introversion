// @flow

import {
  formatSuffix,
  parseSuffix,
  errMustBeNumber,
  errMustBeString
} from "./suffix";

const k = n => n * 10 ** 3;
const m = n => k(k(n));
const g = n => k(m(n));

describe("formatSuffix()", () => {
  test("should throw for wrong types", () => {
    expect(() => formatSuffix((undefined: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix((null: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(("abc": any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix(({}: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix((false: any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix((Symbol(): any))).toThrow(errMustBeNumber());
    expect(() => formatSuffix((Object: any))).toThrow(errMustBeNumber());
  });
  test("should return special numbers unchanged", () => {
    expect(formatSuffix(NaN)).toBe("NaN");
    expect(formatSuffix(Infinity)).toBe("Infinity");
  });
  test("should return ordinary numbers unchanged", () => {
    expect(formatSuffix(0)).toBe("0");
    expect(formatSuffix(555)).toBe("555");
    expect(formatSuffix(999)).toBe("999");
    expect(formatSuffix(-1)).toBe("-1");
    expect(formatSuffix(-555)).toBe("-555");
    expect(formatSuffix(-999)).toBe("-999");
  });
  test('should add "k" suffix', () => {
    expect(formatSuffix(k(1))).toBe("1k");
    expect(formatSuffix(k(1.9))).toBe("1.9k");
    expect(formatSuffix(k(2))).toBe("2k");
    expect(formatSuffix(k(999))).toBe("999k");
    expect(formatSuffix(k(-1))).toBe("-1k");
    expect(formatSuffix(k(-1.9))).toBe("-1.9k");
    expect(formatSuffix(k(-2))).toBe("-2k");
    expect(formatSuffix(k(-999))).toBe("-999k");
  });
  test('should add "M" suffix', () => {
    expect(formatSuffix(m(1))).toBe("1M");
    expect(formatSuffix(m(1.9))).toBe("1.9M");
    expect(formatSuffix(m(2))).toBe("2M");
    expect(formatSuffix(m(999))).toBe("999M");
    expect(formatSuffix(m(-1))).toBe("-1M");
    expect(formatSuffix(m(-1.9))).toBe("-1.9M");
    expect(formatSuffix(m(-2))).toBe("-2M");
    expect(formatSuffix(m(-999))).toBe("-999M");
  });
  test('should add "G" suffix', () => {
    expect(formatSuffix(g(1))).toBe("1G");
    expect(formatSuffix(g(1.9))).toBe("1.9G");
    expect(formatSuffix(g(2))).toBe("2G");
    expect(formatSuffix(g(999))).toBe("999G");
    expect(formatSuffix(g(-1))).toBe("-1G");
    expect(formatSuffix(g(-1.9))).toBe("-1.9G");
    expect(formatSuffix(g(-2))).toBe("-2G");
    expect(formatSuffix(g(-999))).toBe("-999G");
  });
});

describe("parseSuffix()", () => {
  test("should throw for wrong types", () => {
    expect(() => parseSuffix((undefined: any))).toThrow(errMustBeString());
    expect(() => parseSuffix((null: any))).toThrow(errMustBeString());
    expect(() => parseSuffix((999: any))).toThrow(errMustBeString());
    expect(() => parseSuffix(({}: any))).toThrow(errMustBeString());
    expect(() => parseSuffix((false: any))).toThrow(errMustBeString());
    expect(() => parseSuffix((Symbol(): any))).toThrow(errMustBeString());
    expect(() => parseSuffix((Object: any))).toThrow(errMustBeString());
  });
  test("should simple numbers unchanged", () => {
    expect(parseSuffix("0")).toBe(0);
    expect(parseSuffix("123")).toBe(123);
    expect(parseSuffix("1000")).toBe(1000);
    expect(parseSuffix("-1000")).toBe(-1000);
  });
  test("should return NaN for invalid strings", () => {
    expect(parseSuffix("")).toBe(NaN);
    expect(parseSuffix("k")).toBe(NaN);
    expect(parseSuffix("G")).toBe(NaN);
    expect(parseSuffix("M")).toBe(NaN);
    expect(parseSuffix("abc")).toBe(NaN);
    expect(parseSuffix("123abc")).toBe(NaN);
  });
  test("should correctly add a suffix", () => {
    expect(parseSuffix("0k")).toBe(0);
    expect(parseSuffix("0M")).toBe(0);
    expect(parseSuffix("0G")).toBe(0);
    expect(parseSuffix("1k")).toBe(10 ** 3);
    expect(parseSuffix("1M")).toBe(10 ** 6);
    expect(parseSuffix("1G")).toBe(10 ** 9);
    expect(parseSuffix("-1k")).toBe(-(10 ** 3));
    expect(parseSuffix("-1M")).toBe(-(10 ** 6));
    expect(parseSuffix("-1G")).toBe(-(10 ** 9));
    expect(parseSuffix("1.253k")).toBe(1.253 * 10 ** 3);
    expect(parseSuffix("1.253M")).toBe(1.253 * 10 ** 6);
    expect(parseSuffix("1.253G")).toBe(1.253 * 10 ** 9);
    expect(parseSuffix("-1.253k")).toBe(-1.253 * 10 ** 3);
    expect(parseSuffix("-1.253M")).toBe(-1.253 * 10 ** 6);
    expect(parseSuffix("-1.253G")).toBe(-1.253 * 10 ** 9);
  });
});
