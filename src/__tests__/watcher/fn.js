// @flow

import { range } from "ramda";

import { notCallableLastArg } from "../../errors/_";
import Introversion from "../../index";

const name = 9;
const fn = o => o.name;

const print = jest.fn();

const In = Introversion.instance({
  print,
  clone: false,
  stackTrace: false,
  format: false
});

afterEach(() => print.mockClear());

describe("function's watch", () => {
  describe("in normal mode", () => {
    test("should log with In.f()", () => {
      const result = In.f(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("f()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [{ name }]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteRun() and In.f.mute()", () => {
      const action = In.f.mute(1, 2, fn);
      const result = In.unmuteRun(() => action({ name }));
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("f()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [{ name }]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteF() and In.f.mute()", () => {
      const action = In.f.mute(1, 2, fn);
      const result = In.unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("f()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [{ name }]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    describe("when muted", () => {
      test("should not log anything with In.f.mute()", () => {
        const result = In.f.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
  });

  describe("in breakpoint mode", () => {
    test("should not log with In.f_()", () => {
      const result = In.f_(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.f_.mute()", () => {
      const result = In.f_.mute(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.unmuteRun() and In.f_.mute()", () => {
      const result = In.unmuteRun(() => In.f_.mute(1, 2, fn)({ name }));
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("notCallableLastArg", () => {
      expect(() => In.F.mute(1, 2, 3)({ name })).toThrow(
        notCallableLastArg("fn")
      );
    });
    test("should log with In.F()", () => {
      const result = In.F(1, 2, fn)({ name });
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(1);
      expect(print).toBeCalledWith("F()", [1, 2]);
    });
    test("should log with In.unmuteF() and In.F.mute()", () => {
      const action = In.F.mute(1, 2, fn);
      const result = In.unmuteF(action)({ name });
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(1);
      expect(print).toBeCalledWith("F()", [1, 2]);
    });
    describe("when muted", () => {
      test("should not log anything with In.F.mute()", () => {
        const result = In.F.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.f.with({ print: log1, guard: 3 })(fn)({ name });
      In.f.with({ print: log2, guard: 1, id: 2 })(fn)({ name });
      In.f.with({ print: log3, guard: 6, id: 3 })(fn)({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("should throw", () => {
    test("last argument is not callable", () => {
      expect(() => In.f(1, 2, 3)({ name })).toThrow(notCallableLastArg("fn"));
      expect(() => In.f_(1, 2, 3)({ name })).toThrow(notCallableLastArg("fn"));
      expect(() => In.F(1, 2, 3)({ name })).toThrow(notCallableLastArg("fn"));
    });
  });

  test("should proxy this", () => {
    function fn() {
      return this.name;
    }
    expect(In.f(fn).call({ name })).toBe(name);
  });
});
