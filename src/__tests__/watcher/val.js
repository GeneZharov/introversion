// @flow

import { range } from "ramda";

import { debV, logV, logV_, setDefaults, unmuteF, unmuteV, v, v_ } from "../..";
import { defaultConf } from "../../defaultConf";

const name = 9;

const log = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    devTools: false,
    format: false,
    clone: false,
    stackTrace: false,
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => log.mockClear());

describe("value's watcher", () => {
  describe("in normal mode", () => {
    test("should log with no arguments", () => {
      const result = logV();
      expect(result).toBe(undefined);
      expect(log).toBeCalledWith("logV()", []);
    });
    test("should log with logV()", () => {
      const result = logV(1, 2, name);
      expect(result).toBe(name);
      expect(log).toBeCalledWith("logV()", [1, 2, name]);
    });
    test("should log with v()", () => {
      const result = v(1, 2, name);
      expect(result).toBe(name);
      expect(log).toBeCalledWith("v()", [1, 2, name]);
    });
    test("should log with unmuteV() and logV.mute()", () => {
      const result = unmuteV(() => logV.mute(1, 2, name));
      expect(result).toBe(name);
      expect(log).toBeCalledWith("logV()", [1, 2, name]);
    });
    test("should log with unmuteF() and logV.mute()", () => {
      const action = () => logV.mute(1, 2, name);
      const result = unmuteF(action)();
      expect(result).toBe(name);
      expect(log).toBeCalledWith("logV()", [1, 2, name]);
    });
    describe("when muted", () => {
      test("should not log anything with logV.mute()", () => {
        const result = logV.mute(1, 2, name);
        expect(result).toBe(name);
        expect(log).not.toBeCalled();
      });
    });
  });

  describe("in quiet mode", () => {
    test("should log with logV_() and no arguments", () => {
      const result = logV_();
      expect(result).toBe(undefined);
      expect(log).toBeCalledWith("logV_()", []);
    });
    test("should log with logV_()", () => {
      const result = logV_(1, 2, name);
      expect(result).toBe(name);
      expect(log).toBeCalledWith("logV_()", [1, 2]);
    });
    test("should log with v_()", () => {
      const result = v_(1, 2, name);
      expect(result).toBe(name);
      expect(log).toBeCalledWith("v_()", [1, 2]);
    });
    test("should log with unmuteV() and logV_.mute()", () => {
      const result = unmuteV(() => logV_.mute(1, 2, name));
      expect(result).toBe(name);
      expect(log).toBeCalledWith("logV_()", [1, 2]);
    });
    describe("when muted", () => {
      test("should not log anything with logV_.mute()", () => {
        const result = logV_.mute(1, 2, name);
        expect(result).toBe(name);
        expect(log).not.toBeCalled();
      });
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      logV.with({ log: log1, guard: 3 })(name);
      logV.with({ log: log2, guard: 1, id: 2 })(name);
      logV.with({ log: log3, guard: 6, id: 3 })(name);
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });

  describe("In the breakpoint mode", () => {
    test("should log with debV() and no arguments", () => {
      const result = debV();
      expect(result).toBe(undefined);
      expect(log).not.toBeCalled();
    });
    test("should not log with debV()", () => {
      const result = debV(name);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with debV.mute()", () => {
      const result = debV.mute(1, 2, name);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with unmuteV() and debV.mute()", () => {
      const result = unmuteV(() => debV.mute(1, 2, name));
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
  });
});
