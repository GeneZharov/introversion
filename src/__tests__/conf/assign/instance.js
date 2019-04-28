// @flow

import { map } from "ramda";

import { defaultConf } from "../../../conf";
import In from "../../../index";

const log = jest.fn();
const log2 = jest.fn();

afterAll(() => In.setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  log2.mockClear();
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
    In.instance({ stackTraceAsync: false, log }).v(0);
    expect(log).toBeCalled();
  });
  test("should chain and apply configs", () => {
    In.instance({ stackTraceAsync: false })
      .instance({ log })
      .instance({ log: log2 })
      .v(0);
    expect(log).not.toBeCalled();
    expect(log2).toBeCalled();
  });
  test("should compete setDefaults()", () => {
    In.setDefaults({ log, stackTraceAsync: false });
    In.instance({ log: log2 }).v();
    expect(log).not.toBeCalled();
    expect(log2).toBeCalled();
  });
});
