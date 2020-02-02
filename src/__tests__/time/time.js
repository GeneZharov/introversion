// @flow

import { range } from "ramda";

import { instance, setDefaults, time, timeEnd, unmuteF, unmuteV } from "../..";
import { defaultConf } from "../../defaultConf";
import {
  errTimerIdAlreadyExists,
  errTimerIdDoesNotExist,
} from "../../errors/misc";
import { errExtraArgsNotAllowed } from "../../errors/options-runtime";

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
    stackTrace: false,
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  warn.mockClear();
  timer.mockClear();
});

describe("time() and timeEnd()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const id = Symbol("id");
      time.mute(id);
      timeEnd.mute(id);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time without args", () => {
      time();
      timeEnd();
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", "0 ms");
    });
    test("should log time with timerID", () => {
      const id = Symbol("id");
      time(id);
      timeEnd(id);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with unmuteV()", () => {
      const id = Symbol("id");
      const action = () => {
        time.mute(id);
        timeEnd.mute(id);
      };
      unmuteV(action);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
    test("should log with unmuteF()", () => {
      const id = Symbol("id");
      const action = () => {
        time.mute(id);
        timeEnd.mute(id);
      };
      unmuteF(action)();
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeEnd()", [id], "0 ms");
    });
  });

  test('should respect the "guard" option', () => {
    const id = Symbol("id");
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      time.with({ log: log1, guard: 3 })(id);
      timeEnd.with({ log: log1, guard: 3 })(id);
      time.with({ log: log2, guard: 1, id: 2 })(id);
      timeEnd.with({ log: log2, guard: 1, id: 3 })(id);
      time.with({ log: log3, guard: 6, id: 4 })(id);
      timeEnd.with({ log: log3, guard: 6, id: 5 })(id);
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should print a warning", () => {
    test("timer id already exists", () => {
      const id = Symbol("id");
      const [msg] = errTimerIdAlreadyExists(id);
      const In = instance({ timer: "date" });
      In.time(id);
      In.time(id);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("timer id does not exist", () => {
      const id = Symbol("id");
      const [msg] = errTimerIdDoesNotExist(id);
      timeEnd.with({ timer: "date" })(id);
      expect(log).toBeCalledWith("timeEnd()", [id], "NaN ms", "by Date.now()");
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("performance.now() is not available", () => {
      // TODO
    });
    test("extra args are used with console timer", () => {
      const id = Symbol("id");
      const [msg] = errExtraArgsNotAllowed();
      time(id);
      timeEnd.with({ timer: "console" })(1, 2, 3, id);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });
});
