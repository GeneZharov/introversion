// @flow

import { defaultConf } from "../../../defaultConf";
import { logV, setDefaults } from "../../..";

const log = jest.fn();

beforeAll(() => setDefaults({ devTools: false }));

afterAll(() => setDefaults(defaultConf));

afterEach(() => log.mockClear());

describe("setDefaults()", () => {
  test("should throw for not an object", () => {
    expect(() => (setDefaults: any)()).toThrow();
    expect(() => (setDefaults: any)(undefined)).toThrow();
    expect(() => (setDefaults: any)(null)).toThrow();
    expect(() => (setDefaults: any)("")).toThrow();
    expect(() => (setDefaults: any)(4)).toThrow();
    expect(() => (setDefaults: any)(Symbol())).toThrow();
    expect(() => (setDefaults: any)([])).toThrow();
  });
  test("should apply config", () => {
    setDefaults({ log, stackTraceAsync: false });
    logV(0);
    expect(log).toBeCalled();
  });
});
