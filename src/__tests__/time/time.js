// @flow

import { extraArgsNotAllowed, invalidTimeID } from "../../errors/compatibility";
import I from "../../index";

const id = "id";

const print = jest.fn(_ => {});
const timer = jest.fn(_ => 0);

I.config({ format: false, print, timer });

afterEach(() => {
  print.mockClear();
  timer.mockClear();
});

describe("time() and timeEnd()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      I.time.mute(id);
      I.timeEnd.mute(id);
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });
  describe("when unmuted", () => {
    afterEach(() => {
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("Time:", [id], "0ms");
    });
    test("should log time", () => {
      I.time(id);
      I.timeEnd(id);
    });
    test("should log with I.unmuteRun()", () => {
      const action = () => {
        I.time.mute(id);
        I.timeEnd.mute(id);
      };
      I.unmuteRun(action);
    });
    test("should log with I.unmuteF()", () => {
      const action = () => {
        I.time.mute(id);
        I.timeEnd.mute(id);
      };
      I.unmuteF(action)();
    });
  });
  describe("should throw", () => {
    test("param is not a string", () => {
      expect(() => I.time(1)).toThrow(invalidTimeID());
      expect(() => I.timeEnd(1)).toThrow(invalidTimeID());
    });
    test("extra args are used with console timer", () => {
      I.time(id);
      expect(() => I.timeEnd.with({ timer: "console" })(1, 2, 3, id)).toThrow(
        extraArgsNotAllowed(id, [1, 2, 3, id])
      );
    });
  });
});
