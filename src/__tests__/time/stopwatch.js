// @flow

import { range } from "ramda";

import { defaultConf } from "../../defaultConf";
import { errExtraArgsNotAllowed } from "../../errors/options-runtime";
import { lap, setDefaults, stopwatch, unmuteF, unmuteRun } from "../..";

const id = "id";

const log = jest.fn();
const warn = jest.fn();
const timer = jest.fn(_ => 0);

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    format: false,
    clone: false,
    timer,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  warn.mockClear();
  timer.mockClear();
});

describe("stopwatch() and lap()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      stopwatch.mute();
      lap.mute();
      lap.mute();
      lap.mute();
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      stopwatch();
      lap();
      lap();
      lap();
      expect(timer.mock.calls.length).toEqual(7);
      expect(log).toBeCalledWith("lap()", "0 ms");
    });
    test("should log with unmuteRun()", () => {
      const action = () => {
        stopwatch.mute();
        lap.mute();
        lap.mute();
        lap.mute();
      };
      unmuteRun(action);
      expect(timer.mock.calls.length).toEqual(7);
      expect(log).toBeCalledWith("lap()", "0 ms");
    });
    test("should log with unmuteF()", () => {
      const action = () => {
        stopwatch.mute();
        lap.mute();
        lap.mute();
        lap.mute();
      };
      unmuteF(action)();
      expect(timer.mock.calls.length).toEqual(7);
      expect(log).toBeCalledWith("lap()", "0 ms");
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    stopwatch();
    range(0, 100).forEach(_ => {
      lap.with({ log: log1, guard: 3 })();
      lap.with({ log: log2, guard: 1, id: 2 })();
      lap.with({ log: log3, guard: 6, id: 3 })();
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should print a warning", () => {
    test("extra args are used with console timer", () => {
      const [msg] = errExtraArgsNotAllowed();
      stopwatch();
      lap.with({ timer: "console" })(1, 2, 3);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });
});
