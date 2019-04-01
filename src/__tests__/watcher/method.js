// @flow

import {
  notCallableLastArg,
  requiredIdOption
} from "../../errors/compatibility";
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

let result;

const print = jest.fn(_ => {});

I.config({ format: false, print });

afterEach(() => print.mockClear());

describe("methods's watch", () => {
  describe("in the normal mode", () => {
    test("should not log anything with I.m.mute()", () => {
      result = I.m.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print.mock.calls.length).toEqual(3);
        expect(print).toBeCalledWith("F:", [1, 2]);
        expect(print).toBeCalledWith("F Params:", [8]);
        expect(print).toBeCalledWith("F Result:", 9);
      });
      test("should log with I.m() and a short path", () => {
        result = I.m(1, 2, ns.a.b.c, ".fn")(8);
      });
      test("should log with I.m() and a full path", () => {
        result = I.m(1, 2, ns, ".a.b.c.fn")(8);
      });
      test("should log with I.unmuteRun() and I.m.mute()", () => {
        const action = I.m.mute(1, 2, ns, ".a.b.c.fn");
        result = I.unmuteRun(() => action(8));
      });
      test("should log with I.unmuteF() and I.m.mute()", () => {
        const action = I.m.mute(1, 2, ns, ".a.b.c.fn");
        result = I.unmuteF(action)(8);
      });
    });
  });

  describe("in the breakpoint mode", () => {
    afterEach(() => {
      expect(result).toBe(name);
      expect(print).not.toBeCalled();
    });
    test("should not log with I.m_()", () => {
      result = I.m_(1, 2, ns, ".a.b.c.fn")(8);
    });
    test("should not log with I.m_.mute()", () => {
      result = I.m_.mute(1, 2, ns, ".a.b.c.fn")(8);
    });
  });

  describe("in the quiet mode", () => {
    test("notCallableLastArg", () => {
      expect(() => I.M.mute(1, 2, ns, ".a.b.c")({ name })).toThrow(
        notCallableLastArg()
      );
    });
    test("should not log anything with I.M.mute()", () => {
      result = I.M.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    describe("when unmuted", () => {
      afterEach(() => {
        expect(result).toBe(name);
        expect(print.mock.calls.length).toEqual(1);
        expect(print).toBeCalledWith("F:", [1, 2]);
      });
      test("should log with I.M()", () => {
        result = I.M(1, 2, ns, ".a.b.c.fn")(8);
      });
      test("should log with I.unmuteF() and I.M.mute()", () => {
        const action = I.M.mute(1, 2, ns, ".a.b.c.fn");
        result = I.unmuteF(action)(8);
      });
    });
  });

  describe("should throw", () => {
    test("last argument is not callable", () => {
      expect(() => I.m(ns, ".a.b.c")()).toThrow(notCallableLastArg());
      expect(() => I.m_(ns, ".a.b.c")()).toThrow(notCallableLastArg());
      expect(() => I.M(ns, ".a.b.c")()).toThrow(notCallableLastArg());
    });
    test("guard is used without id", () => {
      expect(() => I.m.with({ guard: 1 })(ns, ".a.b.c.fn")()).toThrow(
        requiredIdOption()
      );
      expect(() => I.m_.with({ guard: 1 })(ns, ".a.b.c.fn")()).toThrow(
        requiredIdOption()
      );
      expect(() => I.M.with({ guard: 1 })(ns, ".a.b.c.fn")()).toThrow(
        requiredIdOption()
      );
    });
  });
});
