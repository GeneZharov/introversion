// @flow

import { range } from "ramda";

import { errExtraArgsNotAllowed } from "../../errors/options-runtime";
import Introversion from "../../index";

const id = "ID";

const log = jest.fn();
const warn = jest.fn();
const timer = jest.fn(_ => 0);

const In = Introversion.instance({
  format: false,
  clone: false,
  log,
  warn,
  timer,
  stackTrace: false
});

afterEach(() => {
  log.mockClear();
  warn.mockClear();
  timer.mockClear();
});

describe("time() and timeEnd()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      In.time.mute(id);
      In.timeEnd.mute(id);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time without args", () => {
      In.time();
      In.timeEnd();
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", "0 ms");
    });
    test("should log time with timerID", () => {
      In.time(id);
      In.timeEnd(id);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = () => {
        In.time.mute(id);
        In.timeEnd.mute(id);
      };
      In.unmuteRun(action);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = () => {
        In.time.mute(id);
        In.timeEnd.mute(id);
      };
      In.unmuteF(action)();
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.time.with({ log: log1, guard: 3 })();
      In.timeEnd.with({ log: log1, guard: 3 })();
      In.time.with({ log: log2, guard: 1, id: 2 })();
      In.timeEnd.with({ log: log2, guard: 1, id: 3 })();
      In.time.with({ log: log3, guard: 6, id: 4 })();
      In.timeEnd.with({ log: log3, guard: 6, id: 5 })();
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should print a warning", () => {
    test("performance.now() is not available", () => {
      // FIXME
    });
    test("extra args are used with console timer", () => {
      const [msg] = errExtraArgsNotAllowed();
      In.time(id);
      In.timeEnd.with({ timer: "console" })(1, 2, 3, id);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });
});
