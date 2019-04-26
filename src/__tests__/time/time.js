// @flow

import { range } from "ramda";

import { errExtraArgsNotAllowed } from "../../errors/options-runtime";
import {
  errTimerIdAlreadyExists,
  errTimerIdDoesNotExist
} from "../../errors/_";
import Introversion from "../../index";

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
      const id = Symbol();
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
      const id = Symbol();
      In.time(id);
      In.timeEnd(id);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const id = Symbol();
      const action = () => {
        In.time.mute(id);
        In.timeEnd.mute(id);
      };
      In.unmuteRun(action);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const id = Symbol();
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
    const id = Symbol();
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.time.with({ log: log1, guard: 3 })(id);
      In.timeEnd.with({ log: log1, guard: 3 })(id);
      In.time.with({ log: log2, guard: 1, id: 2 })(id);
      In.timeEnd.with({ log: log2, guard: 1, id: 3 })(id);
      In.time.with({ log: log3, guard: 6, id: 4 })(id);
      In.timeEnd.with({ log: log3, guard: 6, id: 5 })(id);
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should print a warning", () => {
    test("timer id already exists", () => {
      const id = Symbol();
      const [msg] = errTimerIdAlreadyExists(id);
      const _In = In.instance({ timer: "date" });
      _In.time(id);
      _In.time(id);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("timer id does not exist", () => {
      const id = Symbol();
      const [msg] = errTimerIdDoesNotExist(id);
      In.timeEnd.with({ timer: "date" })(id);
      expect(log).toBeCalledWith("timeEnd()", [id], "NaN ms", "by Date.now()");
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("performance.now() is not available", () => {
      // FIXME
    });
    test("extra args are used with console timer", () => {
      const id = Symbol();
      const [msg] = errExtraArgsNotAllowed();
      In.time(id);
      In.timeEnd.with({ timer: "console" })(1, 2, 3, id);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });
});
