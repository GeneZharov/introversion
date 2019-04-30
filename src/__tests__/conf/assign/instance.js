// @flow

import { map } from "ramda";

import In from "../../..";
import { defaultConf } from "../../../defaultConf";
import { instance, setDefaults } from "../../..";

const log = jest.fn();
const log2 = jest.fn();

beforeAll(() => setDefaults({ devTools: false }));

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  log2.mockClear();
});

describe("instance()", () => {
  test("should throw for not an object", () => {
    expect(() => instance()).toThrow();
    expect(() => instance(undefined)).toThrow();
    expect(() => instance(null)).toThrow();
    expect(() => instance("")).toThrow();
    expect(() => instance(4)).toThrow();
    expect(() => instance(Symbol())).toThrow();
    expect(() => instance([])).toThrow();
  });
  test("should return API", () => {
    expect(instance({})).toEqual(map(x => expect.any(Function), In));
  });
  test("should apply config", () => {
    instance({ stackTraceAsync: false, log }).v(0);
    expect(log).toBeCalled();
  });
  test("should chain and apply configs", () => {
    instance({ stackTraceAsync: false })
      .instance({ log })
      .instance({ log: log2 })
      .v(0);
    expect(log).not.toBeCalled();
    expect(log2).toBeCalled();
  });
  test("should compete setDefaults()", () => {
    setDefaults({ log, stackTraceAsync: false });
    instance({ log: log2 }).v();
    expect(log).not.toBeCalled();
    expect(log2).toBeCalled();
  });
});
