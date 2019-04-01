// @flow

import { requiredIdOption } from "../../errors/compatibility";
import I from "../../index";

let result;

const name = 9;

const print = jest.fn(_ => {});

I.config({ format: false, print });

afterEach(() => print.mockClear());

describe("value's watch", () => {
  describe("in normal mode", () => {
    describe("when muted", () => {
      test("should not log anything with I.v.mute()", () => {
        result = I.v.mute(1, 2, name);
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print).toBeCalledWith("V:", [1, 2, name]);
      });
      test("should log with I.v()", () => {
        result = I.v(1, 2, name);
      });
      test("should log with I.unmuteRun() and I.v.mute()", () => {
        result = I.unmuteRun(() => I.v.mute(1, 2, name));
      });
      test("should log with I.unmuteF() and I.v.mute()", () => {
        const action = () => I.v.mute(1, 2, name);
        result = I.unmuteF(action)();
      });
    });
  });

  describe("In the breakpoint mode", () => {
    afterEach(() => {
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with I.v_()", () => {
      result = I.v_(name);
    });
    test("should not log with I.v_.mute()", () => {
      result = I.v_.mute(1, 2, name);
    });
    test("should not log with I.unmuteRun() and I.v_.mute()", () => {
      result = I.unmuteRun(() => I.v_.mute(1, 2, name));
    });
  });

  describe("in quiet mode", () => {
    describe("when muted", () => {
      test("should not log anything with I.V.mute()", () => {
        result = I.V.mute(1, 2, name);
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print).toBeCalledWith("V:", [1, 2]);
      });
      test("should log with I.V()", () => {
        result = I.V(1, 2, name);
      });
      test("should log with I.unmuteRun() and I.V.mute()", () => {
        result = I.unmuteRun(() => I.V.mute(1, 2, name));
      });
    });
  });

  describe("should throw", () => {
    test("guard is used without id", () => {
      expect(() => I.v.with({ guard: 1 })(0)).toThrow(requiredIdOption());
      expect(() => I.v_.with({ guard: 1 })(0)).toThrow(requiredIdOption());
      expect(() => I.V.with({ guard: 1 })(0)).toThrow(requiredIdOption());
    });
  });
});
