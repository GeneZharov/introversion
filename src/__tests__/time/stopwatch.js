// @flow

import { STOPWATCH_ID } from "../../time";
import { extraArgsNotAllowed } from "../../errors/compatibility";
import I from "../../index";

const id = "id";

const print = jest.fn(_ => {});
const timer = jest.fn(_ => 0);

I.config({ format: false, print, timer });

afterEach(() => {
  print.mockClear();
  timer.mockClear();
});

describe("stopwatch() and lap()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      I.stopwatch.mute();
      I.lap.mute();
      I.lap.mute();
      I.lap.mute();
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });
  describe("when unmuted", () => {
    afterEach(() => {
      expect(timer.mock.calls.length).toEqual(7);
      expect(print).toBeCalledWith("Time:", [], "0ms");
    });
    test("should log time", () => {
      I.stopwatch();
      I.lap();
      I.lap();
      I.lap();
    });
    test("should log with I.unmuteRun()", () => {
      const action = () => {
        I.stopwatch.mute();
        I.lap.mute();
        I.lap.mute();
        I.lap.mute();
      };
      I.unmuteRun(action);
    });
    test("should log with I.unmuteF()", () => {
      const action = () => {
        I.stopwatch.mute();
        I.lap.mute();
        I.lap.mute();
        I.lap.mute();
      };
      I.unmuteF(action)();
    });
  });
  describe("should throw", () => {
    test("extra args are used with console timer", () => {
      I.time(id);
      expect(() => {
        I.stopwatch();
        I.lap.with({ timer: "console" })(1, 2, 3);
      }).toThrow(extraArgsNotAllowed(STOPWATCH_ID, [1, 2, 3]));
    });
  });
});
