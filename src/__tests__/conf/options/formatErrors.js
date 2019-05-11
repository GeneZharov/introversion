// @flow

import { defaultConf } from "../../../defaultConf";
import { logV, setDefaults } from "../../..";

const log = jest.fn();
const warn = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    warn,
    format: false,
    stackTrace: false,
    clone: false
  });
});

afterAll(() => setDefaults(defaultConf));

beforeEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe('"formatErrors" option', () => {
  const conf = { kkk: 0 };
  test("should enable warning formatting", () => {
    logV.with(conf).with({ formatErrors: true })(0);
    expect(warn).toBeCalledWith(expect.stringContaining("\u001b[33m▒"));
  });
  test("should disable warning formatting", () => {
    logV.with(conf).with({ formatErrors: false })(0);
    expect(warn).toBeCalledWith(expect.not.stringContaining("\u001b[33m▒"));
  });
});
