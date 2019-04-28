// @flow

import { defaultConf } from "../../../conf";
import In from "../../../index";

const log = jest.fn();
const log2 = jest.fn();
const log3 = jest.fn();

afterAll(() => In.setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  log2.mockClear();
  log3.mockClear();
});

describe(".with()", () => {
  test("should beat setDefaults() and instance()", () => {
    In.setDefaults({
      stackTraceAsync: false,
      log
    });
    const _In = In.instance({
      stackTraceAsync: false,
      log: log2
    });
    _In.v.with({ log: log3 })();
    expect(log).not.toBeCalled();
    expect(log2).not.toBeCalled();
    expect(log3).toBeCalled();
  });
});
