// @flow

import { expectedFuncArg } from "../../errors/_";
import Introversion from "../../index";

const In = Introversion.instance({ format: false });

describe("unmuteF()", () => {
  test("should throw for invalid argument", () => {
    expect(() => In.unmuteF()).toThrow(expectedFuncArg("unmuteF"));
    expect(() => In.unmuteF(0)).toThrow(expectedFuncArg("unmuteF"));
  });
});

describe("unmuteRun()", () => {
  test("should throw for invalid argument", () => {
    expect(() => In.unmuteRun()).toThrow(expectedFuncArg("unmuteRun"));
    expect(() => In.unmuteRun(0)).toThrow(expectedFuncArg("unmuteRun"));
  });
});
