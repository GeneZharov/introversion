// @flow

import { range } from "ramda";

import { setDefaults, timeF, unmuteF, unmuteV } from "../..";
import { defaultConf } from "../../defaultConf";

const name = 9;

const fn = jest.fn(x => x.name);
const log = jest.fn();
const timer = jest.fn(_ => 0);

beforeAll(() => {
  setDefaults({
    devTools: false,
    format: false,
    clone: false,
    log,
    timer,
    stackTrace: false,
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  fn.mockClear();
  log.mockClear();
  timer.mockClear();
});

describe("timeF()", () => {
  describe("when muted", () => {
    test("should not log anything", () => {
      const result = timeF.mute(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(0);
      expect(log).not.toBeCalled();
    });
  });

  describe("when unmuted", () => {
    test("should log time", () => {
      const result = timeF(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
    test("should log with unmuteV()", () => {
      const action = timeF.mute(1, 2, fn);
      const result = unmuteV(() => action({ name }));
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
    test("should log with unmuteF()", () => {
      const action = timeF.mute(1, 2, fn);
      const result = unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(timer.mock.calls.length).toEqual(2);
      expect(log).toBeCalledWith("timeF()", [1, 2], "0 ms");
    });
  });

  describe("should repeat measurements", () => {
    test("should log time", () => {
      timeF.with({ repeat: 5 })(fn)({ name });
      expect(fn.mock.calls.length).toEqual(5);
    });
    test("should log time", () => {
      timeF.with({ repeat: "1k" })(fn)({ name });
      expect(fn.mock.calls.length).toEqual(1000);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      timeF.with({ log: log1, guard: 3 })(fn)({ name });
      timeF.with({ log: log2, guard: 1, id: 2 })(fn)({ name });
      timeF.with({ log: log3, guard: 6, id: 3 })(fn)({ name });
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(timeF(fn).call({ name })).toBe(name);
  });
});
