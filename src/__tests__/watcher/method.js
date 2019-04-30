// @flow

import { range } from "ramda";

import { debM, logM, logM_, setDefaults, unmuteF, unmuteRun } from "../..";
import { defaultConf } from "../../defaultConf";
import { errNotCallableLastArg } from "../../errors/misc";

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

describe("methods's watch", () => {
  describe("in the normal mode", () => {
    test("should not log anything with logM.mute()", () => {
      const result = logM.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(log).not.toBeCalled();
    });
    test("should log with logM() and a short path", () => {
      const result = logM(1, 2, ns.a.b.c, ".fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logM()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with logM() and a full path", () => {
      const result = logM(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logM()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with unmuteRun() and logM.mute()", () => {
      const action = logM.mute(1, 2, ns, ".a.b.c.fn");
      const result = unmuteRun(() => action(8));
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logM()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
    test("should log with unmuteF() and logM.mute()", () => {
      const action = logM.mute(1, 2, ns, ".a.b.c.fn");
      const result = unmuteF(action)(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(3);
      expect(log).toBeCalledWith("logM()", [1, 2]);
      expect(log).toBeCalledWith("... Params:", [8]);
      expect(log).toBeCalledWith("... Result:", 9);
    });
  });

  describe("in the breakpoint mode", () => {
    test("should not log with debM()", () => {
      const result = debM(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
    test("should not log with devM.mute()", () => {
      const result = debM.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log).not.toBeCalled();
    });
  });

  describe("in the quiet mode", () => {
    test("should not log anything with logM_.mute()", () => {
      const result = logM_.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(log).not.toBeCalled();
    });
    test("should log with logM_()", () => {
      const result = logM_(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("logM_()", [1, 2]);
    });
    test("should log with unmuteF() and logM_.mute()", () => {
      const action = logM_.mute(1, 2, ns, ".a.b.c.fn");
      const result = unmuteF(action)(8);
      expect(result).toBe(name);
      expect(log.mock.calls.length).toEqual(1);
      expect(log).toBeCalledWith("logM_()", [1, 2]);
    });
  });

  test('should respect the "guard" option', () => {
    const log1 = jest.fn();
    const log2 = jest.fn();
    const log3 = jest.fn();
    range(0, 100).forEach(_ => {
      logM.with({ log: log1, guard: 3 })(ns, ".a.b.c.fn")({ name });
      logM.with({ log: log2, guard: 1, id: 2 })(ns, ".a.b.c.fn")({ name });
      logM.with({ log: log3, guard: 6, id: 3 })(ns, ".a.b.c.fn")({ name });
    });
    expect(log1.mock.calls.length).toBe(3 * 3);
    expect(log2.mock.calls.length).toBe(1 * 3);
    expect(log3.mock.calls.length).toBe(6 * 3);
  });

  describe("not callable last argument", () => {
    test("muted", () => {
      const [msg] = errNotCallableLastArg("logM");
      const result = logM.mute(1, 2, ns, ".a.b.c")({ name });
      expect(result).toBe(ns.a.b.c);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
    test("unmuted", () => {
      const [msg] = errNotCallableLastArg("logM");
      const result = logM(1, 2, ns, ".a.b.c")({ name });
      expect(result).toBe(ns.a.b.c);
      expect(log).not.toBeCalled();
      expect(warn).toBeCalledWith(expect.stringContaining(msg));
    });
  });

  test("should proxy this", () => {
    expect(logM(ns, ".a.b.c.fn").call({ prop: 0 }, 0)).toBe(0);
  });
});
