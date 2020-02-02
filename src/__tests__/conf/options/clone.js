// @flow

import { logF, logV, setDefaults, time, timeEnd } from "../../..";
import { defaultConf } from "../../../defaultConf";

const a = { a: true };
const b = { b: true };
const c = { c: true };
const fn = () => c;

const log = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    devTools: false,
    format: false,
    stackTrace: false,
  });
});

afterAll(() => setDefaults(defaultConf));

beforeEach(() => log.mockClear());

describe('"clone" option', () => {
  describe("logV()", () => {
    test("should create a deep clone when true", () => {
      logV.with({ clone: true })(a, b);
      const [, [_a, _b]] = log.mock.calls[0];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
    });
    test("should prevent cloning when false", () => {
      logV.with({ clone: false })(a, b);
      const [, [_a, _b]] = log.mock.calls[0];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
    });
  });

  describe("logF()", () => {
    test("should create a deep clone when true", () => {
      logF.with({ clone: true })(a, fn)(b);
      const [, [_a]] = log.mock.calls[0];
      const [, [_b]] = log.mock.calls[1];
      const [, _c] = log.mock.calls[2];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
      expect(_c).not.toBe(c);
      expect(_c).toEqual(c);
    });
    test("should prevent cloning when false", () => {
      logF.with({ clone: false })(a, fn)(b);
      const [, [_a]] = log.mock.calls[0];
      const [, [_b]] = log.mock.calls[1];
      const [, _c] = log.mock.calls[2];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
      expect(_c).toBe(c);
    });
  });

  describe("timeEnd()", () => {
    test("should create a deep clone when true", () => {
      const id = Symbol("id");
      time(id);
      timeEnd.with({ clone: true })(a, b, id);
      const [, [_a, _b]] = log.mock.calls[0];
      expect(_a).not.toBe(a);
      expect(_a).toEqual(a);
      expect(_b).not.toBe(b);
      expect(_b).toEqual(b);
    });
    test("should prevent cloning when false", () => {
      const id = Symbol("id");
      time(id);
      timeEnd.with({ clone: false })(a, b, id);
      const [, [_a, _b]] = log.mock.calls[0];
      expect(_a).toBe(a);
      expect(_b).toBe(b);
    });
  });
});
