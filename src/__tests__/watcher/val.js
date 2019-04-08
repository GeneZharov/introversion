// @flow

import { range } from "ramda";

import Introversion from "../../index";

const name = 9;

const print = jest.fn();

const In = Introversion.instance({
  print,
  format: false,
  stackTrace: false
});

afterEach(() => print.mockClear());

describe("value's watcher", () => {
  describe("in normal mode", () => {
    test("should log with no arguments", () => {
      const result = In.v();
      expect(result).toBe(undefined);
      expect(print).toBeCalledWith("v()", []);
    });
    test("should log with In.v()", () => {
      const result = In.v(1, 2, name);
      expect(result).toBe(name);
      expect(print).toBeCalledWith("v()", [1, 2, name]);
    });
    test("should log with In.unmuteRun() and In.v.mute()", () => {
      const result = In.unmuteRun(() => In.v.mute(1, 2, name));
      expect(result).toBe(name);
      expect(print).toBeCalledWith("v()", [1, 2, name]);
    });
    test("should log with In.unmuteF() and In.v.mute()", () => {
      const action = () => In.v.mute(1, 2, name);
      const result = In.unmuteF(action)();
      expect(result).toBe(name);
      expect(print).toBeCalledWith("v()", [1, 2, name]);
    });
    describe("when muted", () => {
      test("should not log anything with In.v.mute()", () => {
        const result = In.v.mute(1, 2, name);
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
  });

  describe("In the breakpoint mode", () => {
    test("should log with In.v_() and no arguments", () => {
      const result = In.v_();
      expect(result).toBe(undefined);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.v_()", () => {
      const result = In.v_(name);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.v_.mute()", () => {
      const result = In.v_.mute(1, 2, name);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.unmuteRun() and In.v_.mute()", () => {
      const result = In.unmuteRun(() => In.v_.mute(1, 2, name));
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
  });

  describe("in quiet mode", () => {
    test("should log with In.V() and no arguments", () => {
      const result = In.V();
      expect(result).toBe(undefined);
      expect(print).toBeCalledWith("V()", []);
    });
    test("should log with In.V()", () => {
      const result = In.V(1, 2, name);
      expect(result).toBe(name);
      expect(print).toBeCalledWith("V()", [1, 2]);
    });
    test("should log with In.unmuteRun() and In.V.mute()", () => {
      const result = In.unmuteRun(() => In.V.mute(1, 2, name));
      expect(result).toBe(name);
      expect(print).toBeCalledWith("V()", [1, 2]);
    });
    describe("when muted", () => {
      test("should not log anything with In.V.mute()", () => {
        const result = In.V.mute(1, 2, name);
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
      In.v.with({ print: log1, guard: 3 })(name);
      In.v.with({ print: log2, guard: 1, id: 2 })(name);
      In.v.with({ print: log3, guard: 6, id: 3 })(name);
    });
    expect(log1.mock.calls.length).toBe(3);
    expect(log2.mock.calls.length).toBe(1);
    expect(log3.mock.calls.length).toBe(6);
  });
});
