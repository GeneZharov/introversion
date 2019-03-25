// @flow

import I from "../index";

const print = jest.fn(_ => {});

I.config({ format: false, print });

let result;

const name = 9;
const fn = x => x.name;

const obj = {
  prop: 1,
  fn(n) {
    return this.prop + n;
  }
};
const ns = { a: { b: { c: obj } } };

afterEach(() => print.mockClear());

describe("In the normal mode", () => {
  // I.v()
  describe("value's watch", () => {
    describe("when muted", () => {
      test("should not log anything with I.v.mute()", () => {
        result = I.v.mute(1, 2, name);
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when enabled", () => {
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

  // I.f()
  describe("function's watch", () => {
    describe("when disabled", () => {
      test("should not log anything with I.f.mute()", () => {
        result = I.f.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when enabled", () => {
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

  // I.m()
  describe("methods's watch", () => {
    test("should not log anything with I.m.mute()", () => {
      result = I.m.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    describe("when enabled", () => {
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
});

describe("In the breakpoint mode", () => {
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
  test("should not log with I.m_()", () => {
    result = I.m_(1, 2, ns, ".a.b.c.fn")(8);
  });
  test("should not log with I.m_.mute()", () => {
    result = I.m_.mute(1, 2, ns, ".a.b.c.fn")(8);
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
  test("should not log with I.unmuteRun() and I.f_.mute()", () => {
    result = I.unmuteRun(() => I.f_.mute(1, 2, fn)({ name }));
  });
});

describe("In the quiet mode", () => {
  // I.V()
  describe("value's watch", () => {
    describe("when disabled", () => {
      test("should not log anything with I.V.mute()", () => {
        result = I.V.mute(1, 2, name);
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when enabled", () => {
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

  // I.F()
  describe("function's watch", () => {
    describe("when disabled", () => {
      test("should not log anything with I.F.mute()", () => {
        result = I.F.mute(1, 2, fn)({ name });
        expect(result).toBe(name);
        expect(print).not.toBeCalled();
      });
    });
    describe("when enabled", () => {
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

  // I.M()
  describe("methods's watch", () => {
    test("should not log anything with I.M.mute()", () => {
      result = I.M.mute(1, 2, ns, ".a.b.c.fn")(8);
      expect(result).toBe(9);
      expect(print).not.toBeCalled();
    });
    describe("when enabled", () => {
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
});
