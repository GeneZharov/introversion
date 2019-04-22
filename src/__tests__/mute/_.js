// @flow

import { expectedFuncArg } from "../../errors/_";
import Introversion from "../../index";

const In = Introversion.instance({ format: false });

describe("unmuteF()", () => {
  test("should throw for invalid argument", () => {
    expect(() => In.unmuteF()).toThrow(expectedFuncArg("unmuteF"));
    expect(() => In.unmuteF(0)).toThrow(expectedFuncArg("unmuteF"));
  });
  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(In.unmuteF(fn).call({ name: 0 })).toBe(0);
  });
});

describe("unmuteRun()", () => {
  test("should throw for invalid argument", () => {
    expect(() => In.unmuteRun()).toThrow(expectedFuncArg("unmuteRun"));
    expect(() => In.unmuteRun(0)).toThrow(expectedFuncArg("unmuteRun"));
  });
});
