// @flow

import { round } from "./round";

describe("round()", () => {
  test("for NaN", () => {
    expect(round(NaN, NaN)).toBe(NaN);
    expect(round(1, NaN)).toBe(NaN);
  });
  test("for 0", () => {
    expect(round(0, 0)).toBe(0);
    expect(round(0, -0)).toBe(-0);
    expect(round(10, 0)).toBe(0);
  });
  test("for positive fractions", () => {
    expect(round(1, 0.04)).toBe(0);
    expect(round(1, 0.05)).toBe(0.1);
  });
  test("for negative fractions", () => {
    expect(round(1, -0.04)).toBe(0);
    expect(round(1, -0.06)).toBe(-0.1);
  });
});
