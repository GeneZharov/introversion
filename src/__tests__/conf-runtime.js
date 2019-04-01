// @flow

import { invalidTimerReturn } from "../errors/conf-runtime";
import I from "../index";

describe("invalid timer return ", () => {
  const conf = { timer: () => (undefined: any) };
  test("global config", () => {
    I.config(conf);
    expect(() => I.timeRun(() => {})).toThrow(invalidTimerReturn());
  });
  test("in-place config", () => {
    expect(() => I.timeRun.with(conf)(() => {})).toThrow(invalidTimerReturn());
  });
});
