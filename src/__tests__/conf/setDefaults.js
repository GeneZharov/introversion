// @flow

import In from "../../index";

const print = jest.fn();

afterEach(() => print.mockClear());

describe("setDefaults()", () => {
  test("should throw for not an object", () => {
    expect(() => (In.setDefaults: any)()).toThrow();
    expect(() => (In.setDefaults: any)(undefined)).toThrow();
    expect(() => (In.setDefaults: any)(null)).toThrow();
    expect(() => (In.setDefaults: any)("")).toThrow();
    expect(() => (In.setDefaults: any)(4)).toThrow();
    expect(() => (In.setDefaults: any)(Symbol())).toThrow();
    expect(() => (In.setDefaults: any)([])).toThrow();
  });
  test("should apply config", () => {
    In.setDefaults({ print, stackTraceAsync: false });
    In.v(0);
    expect(print).toBeCalled();
  });
});
