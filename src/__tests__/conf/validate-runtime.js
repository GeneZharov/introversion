// @flow

import { invalidTimerReturn } from "../../errors/conf-runtime";
import In from "../../index";

describe("invalid timer return ", () => {
  const conf = { timer: () => (undefined: any) };
  test("global config", () => {
    In.setDefaults(conf);
    expect(() => In.timeRun(() => {})).toThrow(invalidTimerReturn());
  });
  test("instance config", () => {
    const _In = In.instance(conf);
    expect(() => _In.timeRun(() => {})).toThrow(invalidTimerReturn());
  });
  test("in-place config", () => {
    expect(() => In.timeRun.with(conf)(() => {})).toThrow(invalidTimerReturn());
  });
});
