// @flow

import { map } from "ramda";

import In from "../../../index";

const print = jest.fn();
const print2 = jest.fn();

afterEach(() => {
  print.mockClear();
  print2.mockClear();
});

describe("instance()", () => {
  test("should throw for not an object", () => {
    expect(() => In.instance()).toThrow();
    expect(() => In.instance(undefined)).toThrow();
    expect(() => In.instance(null)).toThrow();
    expect(() => In.instance("")).toThrow();
    expect(() => In.instance(4)).toThrow();
    expect(() => In.instance(Symbol())).toThrow();
    expect(() => In.instance([])).toThrow();
  });
  test("should return API", () => {
    expect(In.instance({})).toEqual(map(x => expect.any(Function), In));
  });
  test("should apply config", () => {
    In.instance({ stackTraceAsync: false, print }).v(0);
    expect(print).toBeCalled();
  });
  test("should chain and apply configs", () => {
    In.instance({ stackTraceAsync: false })
      .instance({ print })
      .instance({ print: print2 })
      .v(0);
    expect(print).not.toBeCalled();
    expect(print2).toBeCalled();
  });
  test("should compete setDefaults()", () => {
    In.setDefaults({ print, stackTraceAsync: false });
    In.instance({ print: print2 }).v();
    expect(print).not.toBeCalled();
    expect(print2).toBeCalled();
  });
});
