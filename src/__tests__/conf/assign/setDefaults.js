// @flow

import In from "../../../index";

const log = jest.fn();

afterEach(() => log.mockClear());

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
    In.setDefaults({ log, stackTraceAsync: false });
    In.v(0);
    expect(log).toBeCalled();
  });
});
