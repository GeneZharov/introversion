// @flow

import { range } from "ramda";

import { extraArgsNotAllowed } from "../../errors/conf-runtime";
import Introversion from "../../index";

const id = "id";

const print = jest.fn();
const timer = jest.fn(_ => 0);

const In = Introversion.instance({
  format: false,
  print,
  timer,
  stackTrace: false
});

afterEach(() => {
  print.mockClear();
  timer.mockClear();
});

describe("stopwatch() and lap()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      In.stopwatch.mute();
      In.lap.mute();
      In.lap.mute();
      In.lap.mute();
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      In.stopwatch();
      In.lap();
      In.lap();
      In.lap();
      expect(timer.mock.calls.length).toEqual(7);
      expect(print).toBeCalledWith("lap()", "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = () => {
        In.stopwatch.mute();
        In.lap.mute();
        In.lap.mute();
        In.lap.mute();
      };
      In.unmuteRun(action);
      expect(timer.mock.calls.length).toEqual(7);
      expect(print).toBeCalledWith("lap()", "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = () => {
        In.stopwatch.mute();
        In.lap.mute();
        In.lap.mute();
        In.lap.mute();
      };
      In.unmuteF(action)();
      expect(timer.mock.calls.length).toEqual(7);
      expect(print).toBeCalledWith("lap()", "0 ms");
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    In.stopwatch();
    range(0, 100).forEach(_ => {
      In.lap.with({ print: log1, guard: 3 })();
      In.lap.with({ print: log2, guard: 1, id: 2 })();
      In.lap.with({ print: log3, guard: 6, id: 3 })();
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should throw", () => {
    test("extra args are used with console timer", () => {
      In.time(id);
      expect(() => {
        In.stopwatch();
        In.lap.with({ timer: "console" })(1, 2, 3);
      }).toThrow(extraArgsNotAllowed());
    });
  });
});
