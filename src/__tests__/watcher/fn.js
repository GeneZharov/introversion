// @flow

import { range } from "ramda";

import { errNotCallableLastArg } from "../../errors/_";
import Introversion from "../../index";

const name = 9;
const fn = o => o.name;

const log = jest.fn();
const warn = jest.fn();

const In = Introversion.instance({
  log,
  warn,
  format: false,
  clone: false,
  stackTrace: false
});

afterEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe("function's watch", () => {
  describe("in normal mode", () => {
    test("should log with In.f()", () => {
      const result = In.f(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("f()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteRun() and In.f.mute()", () => {
      const action = In.f.mute(1, 2, fn);
      const result = In.unmuteRun(() => action({ name }));
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("f()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteF() and In.f.mute()", () => {
      const action = In.f.mute(1, 2, fn);
      const result = In.unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("f()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [{ name }]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    describe("when muted", () => {
      test("should not log anything with In.f.mute()", () => {
        const result = In.f.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(log).not.toBeCalled();
      });
    });
  });

  describe("in breakpoint mode", () => {
    test("should not log with In.f_()", () => {
      const result = In.f_(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with In.f_.mute()", () => {
      const result = In.f_.mute(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with In.unmuteRun() and In.f_.mute()", () => {
      const result = In.unmuteRun(() => In.f_.mute(1, 2, fn)({ name }));
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("should log with In.F()", () => {
      const result = In.F(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("F()", [1, 2]);
    });
    test("should log with In.unmuteF() and In.F.mute()", () => {
      const action = In.F.mute(1, 2, fn);
      const result = In.unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("F()", [1, 2]);
    });
    describe("when muted", () => {
      test("should not log anything with In.F.mute()", () => {
        const result = In.F.mute(1, 2, fn)({ name });
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
      In.f.with({ log: log1, guard: 3 })(fn)({ name });
      In.f.with({ log: log2, guard: 1, id: 2 })(fn)({ name });
      In.f.with({ log: log3, guard: 6, id: 3 })(fn)({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("not callable last argument", () => {
    test("muted", () => {
      const [msg] = errNotCallableLastArg("fn");
      const result = In.f.mute(1, 2, 3)({ name });
      expect(result).toBe(3);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("unmuted", () => {
      const [msg] = errNotCallableLastArg("fn");
      const result = In.f(1, 2, 3)({ name });
      expect(result).toBe(3);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });

  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(In.f(fn).call({ name })).toBe(name);
  });
});
