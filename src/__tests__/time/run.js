// @flow

import { range } from "ramda";

import { defaultConf } from "../../defaultConf";
import { setDefaults, timeRun, unmuteF, unmuteRun } from "../..";

const name = 9;

const fn = jest.fn(x => x.name);
const log = jest.fn();
const timer = jest.fn(_ => 0);

beforeAll(() => {
  setDefaults({
    log,
    devTools: false,
    format: false,
    clone: false,
    timer,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  fn.mockClear();
  log.mockClear();
  timer.mockClear();
});

describe("timeRun()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = timeRun.mute(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = timeRun(1, 2, () => fn({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with unmuteRun()", () => {
      const action = () => timeRun.mute(1, 2, () => fn({ name }));
      const result = unmuteRun(action);
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
    test("should log with unmuteF()", () => {
      const action = () => timeRun.mute(1, 2, () => fn({ name }));
      const result = unmuteF(action)();
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeRun()", [1, 2], "0 ms");
    });
  });

  describe("should repeat measurements", () => {
    test("should log time", () => {
      timeRun.with({ repeat: 5 })(() => fn({ name }));
      expect(fn.mock.calls.length).toEqual(5);
    });
    test("should log time", () => {
      timeRun.with({ repeat: "1k" })(() => fn({ name }));
      expect(fn.mock.calls.length).toEqual(1000);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      timeRun.with({ log: log1, guard: 3 })(() => fn({ name }));
      timeRun.with({ log: log2, guard: 1, id: 2 })(() => fn({ name }));
      timeRun.with({ log: log3, guard: 6, id: 3 })(() => fn({ name }));
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });
});
