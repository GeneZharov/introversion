// @flow

import { range } from "ramda";

import Introversion from "../../index";

const id = "id";
const name = 9;
const obj = {
  prop: 1,
  fn(n) {
    return this.prop + n;
  }
};
const ns = { a: { b: { c: obj } } };

const log = jest.fn();
const timer = jest.fn(_ => 0);

const In = Introversion.instance({
  format: false,
  clone: false,
  log,
  timer,
  stackTrace: false
});

afterEach(() => {
  log.mockClear();
  timer.mockClear();
});

describe("timeM()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = In.timeM.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = In.timeM(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeM()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = In.timeM.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteRun(() => action(8));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeM()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = In.timeM.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeM()", [1, 2], "0 ms");
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.timeM.with({ log: log1, guard: 3 })(ns, ".a.b.c.fn")({ name });
      In.timeM.with({ log: log2, guard: 1, id: 2 })(ns, ".a.b.c.fn")({
        name
      });
      In.timeM.with({ log: log3, guard: 6, id: 3 })(ns, ".a.b.c.fn")({
        name
      });
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  test("should proxy this", () => {
    expect(In.timeM(ns, ".a.b.c.fn").call({ prop: 0 }, 0)).toBe(0);
  });
});
