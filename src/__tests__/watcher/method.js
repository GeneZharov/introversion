// @flow

import { range } from "ramda";

import { notCallableLastArg } from "../../errors/_";
import I from "../../index";

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

I.setDefaults({
  format: false,
  print,
  stackTrace: false
});

afterEach(() => print.mockClear());

describe("methods's watch", () => {
  describe("in the normal mode", () => {
    test("should not log anything with I.m.mute()", () => {
      const result = I.m.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    test("should log with I.m() and a short path", () => {
      const result = I.m(1, 2, ns.a.b.c, ".fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with I.m() and a full path", () => {
      const result = I.m(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with I.unmuteRun() and I.m.mute()", () => {
      const action = I.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = I.unmuteRun(() => action(8));
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
    test("should log with I.unmuteF() and I.m.mute()", () => {
      const action = I.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = I.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(3);
      expect(print).toBeCalledWith("m()", [1, 2]);
      expect(print).toBeCalledWith("... Params:", [8]);
      expect(print).toBeCalledWith("... Result:", 9);
    });
  });

  describe("in the breakpoint mode", () => {
    test("should not log with I.m_()", () => {
      const result = I.m_(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with I.m_.mute()", () => {
      const result = I.m_.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("notCallableLastArg", () => {
      expect(() => I.M.mute(1, 2, ns, ".a.b.c")({ name })).toThrow(
        notCallableLastArg("fn")
      );
    });
    test("should not log anything with I.M.mute()", () => {
      const result = I.M.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    test("should log with I.M()", () => {
      const result = I.M(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(print.mock.calls.length).toEqual(1);
      expect(print).toBeCalledWith("M()", [1, 2]);
    });
    test("should log with I.unmuteF() and I.M.mute()", () => {
      const action = I.M.mute(1, 2, ns, ".a.b.c.fn");
      const result = I.unmuteF(action)(8);
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
      I.m.with({ print: log1, guard: 3 })(ns, ".a.b.c.fn")({ name });
      I.m.with({ print: log2, guard: 1, id: 2 })(ns, ".a.b.c.fn")({ name });
      I.m.with({ print: log3, guard: 6, id: 3 })(ns, ".a.b.c.fn")({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("should throw", () => {
    test("last argument is not callable", () => {
      expect(() => I.m(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
      expect(() => I.m_(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
      expect(() => I.M(ns, ".a.b.c")()).toThrow(notCallableLastArg("fn"));
    });
  });
});
