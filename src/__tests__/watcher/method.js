// @flow

import { range } from "ramda";

import { errNotCallableLastArg } from "../../errors/_";
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

describe("methods's watch", () => {
  describe("in the normal mode", () => {
    test("should not log anything with In.m.mute()", () => {
      const result = In.m.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(log).not.toBeCalled();
    });
    test("should log with In.m() and a short path", () => {
      const result = In.m(1, 2, ns.a.b.c, ".fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("m()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.m() and a full path", () => {
      const result = In.m(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("m()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteRun() and In.m.mute()", () => {
      const action = In.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteRun(() => action(8));
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("m()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with In.unmuteF() and In.m.mute()", () => {
      const action = In.m.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("m()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
  });

  describe("in the breakpoint mode", () => {
    test("should not log with In.m_()", () => {
      const result = In.m_(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with In.m_.mute()", () => {
      const result = In.m_.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("should not log anything with In.M.mute()", () => {
      const result = In.M.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(log).not.toBeCalled();
    });
    test("should log with In.M()", () => {
      const result = In.M(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("M()", [1, 2]);
    });
    test("should log with In.unmuteF() and In.M.mute()", () => {
      const action = In.M.mute(1, 2, ns, ".a.b.c.fn");
      const result = In.unmuteF(action)(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("M()", [1, 2]);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      In.m.with({ log: log1, guard: 3 })(ns, ".a.b.c.fn")({ name });
      In.m.with({ log: log2, guard: 1, id: 2 })(ns, ".a.b.c.fn")({ name });
      In.m.with({ log: log3, guard: 6, id: 3 })(ns, ".a.b.c.fn")({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("not callable last argument", () => {
    test("muted", () => {
      const [msg] = errNotCallableLastArg("fn");
      const result = In.m.mute(1, 2, ns, ".a.b.c")({ name });
      expect(result).toBe(ns.a.b.c);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("unmuted", () => {
      const [msg] = errNotCallableLastArg("fn");
      const result = In.m(1, 2, ns, ".a.b.c")({ name });
      expect(result).toBe(ns.a.b.c);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });

  test("should proxy this", () => {
    expect(In.m(ns, ".a.b.c.fn").call({ prop: 0 }, 0)).toBe(0);
  });
});
