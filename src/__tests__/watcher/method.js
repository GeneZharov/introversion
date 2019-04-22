// @flow

import { range } from "ramda";

import { notCallableLastArg } from "../../errors/_";
import Introversion from "../../index";

const name = 9;
const fn = x => x.name;
const obj = {
  prop: 1,
  fn(n) {
    return this.prop + n;
  }
};
const ns = { a: { b: { c: obj } } };

const print = jest.fn();

const In = Introversion.instance({
  print,
  format: false,
  stackTrace: false
});

afterEach(() => print.mockClear());

describe("methods's watch", () => {
  describe("in the normal mode", () => {
    test("should not log anything with In.m.mute()", () => {
      const result = In.m.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    test("should log with In.m() and a short path", () => {
      const result = In.m(1, 2, ns.a.b.c, ".fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.m() and a full path", () => {
      const result = In.m(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteRun() and In.m.mute()", () => {
      const action = In.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteRun(() => action(8));
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteF() and In.m.mute()", () => {
      const action = In.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
  });

  describe("in the breakpoint mode", () => {
    test("should not log with In.m_()", () => {
      const result = In.m_(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with In.m_.mute()", () => {
      const result = In.m_.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("notCallableLastArg", () => {
      expect(() => In.M.mute(1, 2, ns, ".a.b.c")({ name })).toThrow(
        notCallableLastArg("fn")
      );
    });
    test("should not log anything with In.M.mute()", () => {
      const result = In.M.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    test("should log with In.M()", () => {
      const result = In.M(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(1);
      expect(print).toBeCalledWith("M()", [1, 2]);
    });
    test("should log with In.unmuteF() and In.M.mute()", () => {
      const action = In.M.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(1);
      expect(print).toBeCalledWith("M()", [1, 2]);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.m.with({ print: log1, guard: 3 })(ns, ".a.b.c.fn")({ name });
      In.m.with({ print: log2, guard: 1, id: 2 })(ns, ".a.b.c.fn")({ name });
      In.m.with({ print: log3, guard: 6, id: 3 })(ns, ".a.b.c.fn")({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("should throw", () => {
    test("last argument is not callable", () => {
      expect(() => In.m(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
      expect(() => In.m_(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
      expect(() => In.M(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
    });
  });

  test("should proxy this", () => {
    expect(In.m(ns, ".a.b.c.fn").call({ prop: 0 }, 0)).toBe(0);
  });
});
