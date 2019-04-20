// @flow

import Introversion from "../../../index";

const FILE = "stacktrace.js";

const print = jest.fn();

const In = Introversion.instance({
  print,
  format: false,
  stackTraceAsync: false
});

beforeEach(() => print.mockClear());

describe("correct stack frame", () => {
  test("should print with v()", () => {
    In.v.with({ stackTrace: ["func", "file"] })();
    expect(print.mock.calls[0][1]).toBe(`at Object.test (${FILE})`);
  });
  test("should print with f()", () => {
    const fn = () => {};
    In.f.with({ stackTrace: ["func", "file"] })(fn)();
    expect(print.mock.calls[0][1]).toBe(`at Object.test (${FILE})`);
  });
});

describe("stackTrace option", () => {
  describe("full stack trace data", () => {
    afterEach(() => {
      expect(print.mock.calls[0][1]).toEqual(
        expect.stringMatching(
          new RegExp(`at Object\\.test \\(${FILE}:\\d+:\\d+\\)`)
        )
      );
    });
    test("should log with 'true'", () => {
      In.v.with({ stackTrace: true })();
    });
    test("should log with a full array of items", () => {
      In.v.with({ stackTrace: ["func", "file", "line", "col"] })();
    });
  });

  describe("no stack trace data", () => {
    afterEach(() => {
      expect(print).toBeCalledWith("v()", []);
    });
    test("should not log with 'false'", () => {
      In.v.with({ stackTrace: false })();
    });
    test("should not log with an empty array", () => {
      In.v.with({ stackTrace: [] })();
    });
  });
});

describe("stackTraceShift option", () => {
  test("should allow to select a frame", () => {
    function testFunc() {
      In.v.with({ stackTrace: ["func"], stackTraceShift: 1 })();
    }
    testFunc();
    expect(print.mock.calls[0][1]).toBe("at Object.testFunc");
  });
});
