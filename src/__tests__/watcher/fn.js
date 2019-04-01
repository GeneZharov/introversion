// @flow

import {
  notCallableLastArg,
  requiredIdOption
} from "../../errors/compatibility";
import I from "../../index";

const name = 9;
const fn = x => x.name;

let result;

const print = jest.fn(_ => {});

I.config({ format: false, print });

afterEach(() => print.mockClear());

describe("function's watch", () => {
  describe("in normal mode", () => {
    describe("when muted", () => {
      test("should not log anything with I.f.mute()", () => {
        result = I.f.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print.mock.calls.length).toEqual(3);
        expect(print).toBeCalledWith("F:", [1, 2]);
        expect(print).toBeCalledWith("F Params:", [{ name }]);
        expect(print).toBeCalledWith("F Result:", 9);
      });
      test("should log with I.f()", () => {
        result = I.f(1, 2, fn)({ name });
      });
      test("should log with I.unmuteRun() and I.f.mute()", () => {
        const action = I.f.mute(1, 2, fn);
        result = I.unmuteRun(() => action({ name }));
      });
      test("should log with I.unmuteF() and I.f.mute()", () => {
        const action = I.f.mute(1, 2, fn);
        result = I.unmuteF(action)({ name });
      });
    });
  });

  describe("in breakpoint mode", () => {
    afterEach(() => {
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with I.f_()", () => {
      result = I.f_(1, 2, fn)({ name });
    });
    test("should not log with I.f_.mute()", () => {
      result = I.f_.mute(1, 2, fn)({ name });
    });
    test("should not log with I.unmuteRun() and I.f_.mute()", () => {
      result = I.unmuteRun(() => I.f_.mute(1, 2, fn)({ name }));
    });
  });

  describe("in the quiet mode", () => {
    test("notCallableLastArg", () => {
      expect(() => I.F.mute(1, 2, 3)({ name })).toThrow(notCallableLastArg());
    });
    describe("when muted", () => {
      test("should not log anything with I.F.mute()", () => {
        result = I.F.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print.mock.calls.length).toEqual(1);
        expect(print).toBeCalledWith("F:", [1, 2]);
      });
      test("should log with I.F()", () => {
        result = I.F(1, 2, fn)({ name });
      });
      test("should log with I.unmuteF() and I.F.mute()", () => {
        const action = I.F.mute(1, 2, fn);
        result = I.unmuteF(action)({ name });
      });
    });
  });

  describe("should throw", () => {
    test("last argument is not callable", () => {
      expect(() => I.f(1, 2, 3)({ name })).toThrow(notCallableLastArg());
      expect(() => I.f_(1, 2, 3)({ name })).toThrow(notCallableLastArg());
      expect(() => I.F(1, 2, 3)({ name })).toThrow(notCallableLastArg());
    });
    test("guard is used without id", () => {
      expect(() => I.f.with({ guard: 1 })(() => {})()).toThrow(
        requiredIdOption()
      );
      expect(() => I.f_.with({ guard: 1 })(() => {})()).toThrow(
        requiredIdOption()
      );
      expect(() => I.F.with({ guard: 1 })(() => {})()).toThrow(
        requiredIdOption()
      );
    });
  });
});
