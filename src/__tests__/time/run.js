// @flow

import { range } from "ramda";

import Introversion from "../../index";

const id = "id";
const name = 9;

const fn = jest.fn(x => x.name);
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
  fn.mockClear();
  log.mockClear();
  timer.mockClear();
});

describe("timeRun()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = In.timeRun.mute(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = In.timeRun(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteRun()", () => {
      const action = () => In.timeRun.mute(1, 2, () => fn({ name }));
      const result = In.unmuteRun(action);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with In.unmuteF()", () => {
      const action = () => In.timeRun.mute(1, 2, () => fn({ name }));
      const result = In.unmuteF(action)();
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
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
      In.timeRun.with({ log: log1, guard: 3 })(() => fn({ name }));
      In.timeRun.with({ log: log2, guard: 1, id: 2 })(() => fn({ name }));
      In.timeRun.with({ log: log3, guard: 6, id: 3 })(() => fn({ name }));
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });
});