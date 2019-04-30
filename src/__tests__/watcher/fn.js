// @flow

import { range } from "ramda";

import {
  debF,
  f,
  f_,
  logF,
  logF_,
  setDefaults,
  unmuteF,
  unmuteRun
} from "../..";
import { defaultConf } from "../../defaultConf";
import { errNotCallableLastArg } from "../../errors/misc";

const name = 9;
const fn = o => o.name;

const log = jest.fn();
const warn = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    format: false,
    clone: false,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe("function's watch", () => {
  describe("in normal mode", () => {
    test("should log with logF()", () => {
      const result = logF(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logF()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with f()", () => {
      const result = f(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("f()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with unmuteRun() and logF.mute()", () => {
      const action = logF.mute(1, 2, fn);
      const result = unmuteRun(() => action({ name }));
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logF()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with unmuteF() and logF.mute()", () => {
      const action = logF.mute(1, 2, fn);
      const result = unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logF()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    describe("when muted", () => {
      test("should not log anything with logF.mute()", () => {
        const result = logF.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(log).not.toBeCalled();
      });
    });
  });

  describe("in the quiet mode", () => {
    test("should log with logF_()", () => {
      const result = logF_(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("logF_()", [1, 2]);
    });
    test("should log with f_()", () => {
      const result = f_(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("f_()", [1, 2]);
    });
    test("should log with unmuteF() and logF_.mute()", () => {
      const action = logF_.mute(1, 2, fn);
      const result = unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("logF_()", [1, 2]);
    });
    describe("when muted", () => {
      test("should not log anything with logF_.mute()", () => {
        const result = logF_.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(log).not.toBeCalled();
      });
    });
  });

  describe("in breakpoint mode", () => {
    test("should not log with debF()", () => {
      const result = debF(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with debF.mute()", () => {
      const result = debF.mute(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with unmuteRun() and debF.mute()", () => {
      const result = unmuteRun(() => debF.mute(1, 2, fn)({ name }));
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      logF.with({ log: log1, guard: 3 })(fn)({ name });
      logF.with({ log: log2, guard: 1, id: 2 })(fn)({ name });
      logF.with({ log: log3, guard: 6, id: 3 })(fn)({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("not callable last argument", () => {
    test("muted", () => {
      const [msg] = errNotCallableLastArg("logF");
      const result = logF.mute(1, 2, 3)({ name });
      expect(result).toBe(3);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("unmuted", () => {
      const [msg] = errNotCallableLastArg("logF");
      const result = logF(1, 2, 3)({ name });
      expect(result).toBe(3);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });

  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(logF(fn).call({ name })).toBe(name);
  });
});
