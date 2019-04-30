// @flow

import { defaultConf } from "../../../defaultConf";
import { errUnknownOpt } from "../../../errors/options";
import { logV, setDefaults } from "../../..";

const log = jest.fn();
const warn = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    format: false,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

beforeEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe('"errorHandling" option', () => {
  const conf = { kkk: 0 };
  const [msg] = errUnknownOpt("kkk");
  test("should warn by default", () => {
    logV.with(conf)(0);
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should throw as specified", () => {
    expect(() => logV.with(conf).with({ errorHandling: "throw" })(0)).toThrow(
      msg
    );
  });
  test("should warn as specified", () => {
    logV.with(conf).with({ errorHandling: "warn" })(0);
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
});
