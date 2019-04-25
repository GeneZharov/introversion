// @flow

import { errExpectedFuncArg } from "../../errors/_";
import Introversion from "../../index";

const log = jest.fn();
const warn = jest.fn();

const In = Introversion.instance({
  log,
  warn,
  format: false,
  clone: false,
  stackTrace: false
});

describe("unmuteF()", () => {
  test("not callable argument", () => {
    const [msg] = errExpectedFuncArg("unmuteF");
    const result = In.unmuteF(null);
    expect(result).toBe(null);
    expect(log).not.toBeCalled();
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(In.unmuteF(fn).call({ name: 0 })).toBe(0);
  });
});

describe("unmuteRun()", () => {
  test("not callable argument", () => {
    const [msg] = errExpectedFuncArg("unmuteRun");
    const result = In.unmuteRun(null);
    expect(result).toBe(null);
    expect(log).not.toBeCalled();
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
});
