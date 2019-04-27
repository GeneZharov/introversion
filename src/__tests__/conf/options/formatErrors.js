// @flow

import { errUnknownOpt } from "../../../errors/options";
import Introversion from "../../../index";

const log = jest.fn();
const warn = jest.fn();

const In = Introversion.instance({
  log,
  warn,
  format: false,
  stackTrace: false,
  clone: false
});

beforeEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe('"formatErrors" option', () => {
  const conf = { kkk: 0 };
  const [msg] = errUnknownOpt("kkk");
  test("should enable warning formatting", () => {
    In.v.with(conf).with({ formatErrors: true })(0);
    expect(warn).toBeCalledWith(expect.stringContaining("\u001b[33m▒"));
  });
  test("should disable warning formatting", () => {
    In.v.with(conf).with({ formatErrors: false })(0);
    expect(warn).toBeCalledWith(expect.not.stringContaining("\u001b[33m▒"));
  });
});
