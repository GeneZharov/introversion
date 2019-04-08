// @flow

import { range } from "ramda";

import {
  extraArgsNotAllowed,
  repeatNotAllowed
} from "../../errors/conf-compatibility";
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

describe("timeRun()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = In.timeRun.mute(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(print).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = In.timeRun(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = () => In.timeRun.mute(1, 2, () => fn({ name }));
      const result = In.unmuteRun(action);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = () => In.timeRun.mute(1, 2, () => fn({ name }));
      const result = In.unmuteF(action)();
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(print).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
  });

  describe("should repeat measurements", () => {
    test("should log time", () => {
      In.timeRun.with({ repeat: 5 })(() => fn({ name }));
      expect(fn.mock.calls.length).toEqual(5);
    });
    test("should log time", () => {
      In.timeRun.with({ repeat: "1k" })(() => fn({ name }));
      expect(fn.mock.calls.length).toEqual(1000);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.timeRun.with({ print: log1, guard: 3 })(() => fn({ name }));
      In.timeRun.with({ print: log2, guard: 1, id: 2 })(() => fn({ name }));
      In.timeRun.with({ print: log3, guard: 6, id: 3 })(() => fn({ name }));
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("should throw", () => {
    jest.spyOn(global.console, "time").mockImplementation(() => {});
    jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
    test("extra args are used with console timer", () => {
      expect(() => {
        In.timeRun.with({ id, timer: "console" })(1, 2, fn => ({ name }));
      }).toThrow(extraArgsNotAllowed());
    });
    test('"repeat" option with console timer', () => {
      expect(() => {
        In.timeRun.with({ repeat: 2, timer: "console" })(() => fn({ name }));
      }).toThrow(repeatNotAllowed());
    });
  });
});
