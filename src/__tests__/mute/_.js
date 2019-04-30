// @flow

import { defaultConf } from "../../defaultConf";
import { errExpectedFuncArg } from "../../errors/misc";
import { setDefaults, unmuteF, unmuteRun } from "../..";

const log = jest.fn();
const warn = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    format: false,
    clone: false,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

describe("unmuteF()", () => {
  test("not callable argument", () => {
    const [msg] = errExpectedFuncArg("unmuteF");
    const result = unmuteF(null);
    expect(result).toBe(null);
    expect(log).not.toBeCalled();
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(unmuteF(fn).call({ name: 0 })).toBe(0);
  });
});

describe("unmuteRun()", () => {
  test("not callable argument", () => {
    const [msg] = errExpectedFuncArg("unmuteRun");
    const result = unmuteRun(null);
    expect(result).toBe(null);
    expect(log).not.toBeCalled();
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
});
