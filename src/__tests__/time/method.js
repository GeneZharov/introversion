// @flow

import {
  extraArgsNotAllowed,
  repeatNotAllowed
} from "../../errors/compatibility";
import I from "../../index";

const id = "id";
const name = 9;
const obj = {
  prop: 1,
  fn(n) {
    return this.prop + n;
  }
};
const ns = { a: { b: { c: obj } } };

let result;

const print = jest.fn(_ => {});
const timer = jest.fn(_ => 0);

I.config({ format: false, print, timer });

afterEach(() => {
  print.mockClear();
  timer.mockClear();
});

describe("timeM()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      result = I.timeM.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });
  describe("when unmuted", () => {
    afterEach(() => {
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("Time:", [1, 2], "0ms");
    });
    test("should log time", () => {
      result = I.timeM(1, 2, ns, ".a.b.c.fn")(8);
    });
    test("should log with I.unmuteRun()", () => {
      const action = I.timeM.mute(1, 2, ns, ".a.b.c.fn");
      result = I.unmuteRun(() => action(8));
    });
    test("should log with I.unmuteF()", () => {
      const action = I.timeM.mute(1, 2, ns, ".a.b.c.fn");
      result = I.unmuteF(action)(8);
    });
  });
  describe("should throw", () => {
    test("extra args are used with console timer", () => {
      expect(() => {
        I.timeM.with({ id, timer: "console" })(1, 2, ns, ".a.b.c.fn")({ name });
      }).toThrow(extraArgsNotAllowed(id, [1, 2]));
    });
    test('"repeat" option with console timer', () => {
      expect(() => {
        I.timeM.with({ repeat: 2, timer: "console" })(ns, ".a.b.c.fn")({
          name
        });
      }).toThrow(repeatNotAllowed());
    });
  });
});
