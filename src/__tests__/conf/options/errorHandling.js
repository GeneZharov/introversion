// @flow

import { errUnknownOpt } from "../../../errors/options";
import Introversion from "../../../index";

const log = jest.fn();
const warn = jest.fn();

const In = Introversion.instance({
  log,
  warn,
  format: false,
  stackTrace: false
});

beforeEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe('"errorHandling" option', () => {
  const conf = { kkk: 0 };
  const [msg] = errUnknownOpt("kkk");
  test("should warn by default", () => {
    In.v.with(conf)(0);
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should throw as specified", () => {
    expect(() => In.v.with(conf).with({ errorHandling: "throw" })(0)).toThrow(
      msg
    );
  });
  test("should warn as specified", () => {
    In.v.with(conf).with({ errorHandling: "warn" })(0);
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
});
