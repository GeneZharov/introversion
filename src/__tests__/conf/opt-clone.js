// @flow

import Introversion from "../../index";

const print = jest.fn();

const In = Introversion.instance({
  print,
  format: false,
  stackTrace: false
});

const a = { a: true };
const b = { b: true };
const c = { c: true };
const fn = () => c;

beforeEach(() => print.mockClear());

describe('"clone" option', () => {
  describe("v()", () => {
    test("should create a deep clone when true", () => {
      In.v.with({ clone: true })(a, b);
      const [, [_a, _b]] = print.mock.calls[0];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
    });
    test("should prevent cloning when false", () => {
      In.v.with({ clone: false })(a, b);
      const [, [_a, _b]] = print.mock.calls[0];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
    });
  });

  describe("f()", () => {
    test("should create a deep clone when true", () => {
      In.f.with({ clone: true })(a, fn)(b);
      const [, [_a]] = print.mock.calls[0];
      const [, [_b]] = print.mock.calls[1];
      const [, _c] = print.mock.calls[2];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
      expect(_c).not.toBe(c);
      expect(_c).toEqual(c);
    });
    test("should prevent cloning when false", () => {
      In.f.with({ clone: false })(a, fn)(b);
      const [, [_a]] = print.mock.calls[0];
      const [, [_b]] = print.mock.calls[1];
      const [, _c] = print.mock.calls[2];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
      expect(_c).toBe(c);
    });
  });

  describe("timeEnd()", () => {
    test("should create a deep clone when true", () => {
      In.time();
      In.timeEnd.with({ clone: true })(a, b);
      const [, [_a, _b]] = print.mock.calls[0];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
    });
    test("should prevent cloning when false", () => {
      In.time();
      In.timeEnd.with({ clone: false })(a, b);
      const [, [_a, _b]] = print.mock.calls[0];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
    });
  });
});
