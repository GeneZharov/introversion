// @flow

import { range } from "ramda";

import Introversion from "../../index";

const id = "id";
const name = 9;

const fn = jest.fn(x => x.name);
const print = jest.fn();
const timer = jest.fn(_ => 0);

const In = Introversion.instance({
  format: false,
  print,
  timer,
  stackTrace: false
});

afterEach(() => {
  fn.mockClear();
  print.mockClear();
  timer.mockClear();
});

describe("timeF()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = In.timeF.mute(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = In.timeF(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = In.timeF.mute(1, 2, fn);
      const result = In.unmuteRun(() => action({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = In.timeF.mute(1, 2, fn);
      const result = In.unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
  });

  describe("should repeat measurements", () => {
    test("should log time", () => {
      In.timeF.with({ repeat: 5 })(fn)({ name });
      expect(fn.mock.calls.length).toEqual(5);
    });
    test("should log time", () => {
      In.timeF.with({ repeat: "1k" })(fn)({ name });
      expect(fn.mock.calls.length).toEqual(1000);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.timeF.with({ print: log1, guard: 3 })(fn)({ name });
      In.timeF.with({ print: log2, guard: 1, id: 2 })(fn)({ name });
      In.timeF.with({ print: log3, guard: 6, id: 3 })(fn)({ name });
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });
});
