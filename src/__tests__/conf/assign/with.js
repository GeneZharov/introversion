// @flow

import { defaultConf } from "../../../defaultConf";
import { instance, setDefaults } from "../../..";

const log = jest.fn();
const log2 = jest.fn();
const log3 = jest.fn();

beforeAll(() => setDefaults({ devTools: false }));

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  log2.mockClear();
  log3.mockClear();
});

describe(".with()", () => {
  test("should beat setDefaults() and instance()", () => {
    setDefaults({
      stackTraceAsync: false,
      log
    });
    const In = instance({
      stackTraceAsync: false,
      log: log2
    });
    In.v.with({ log: log3 })();
    expect(log).not.toBeCalled();
    expect(log2).not.toBeCalled();
    expect(log3).toBeCalled();
  });
});
