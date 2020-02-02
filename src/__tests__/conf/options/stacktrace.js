// @flow

// TODO: Broken stacktrace entries

import { logF, logV, setDefaults } from "../../..";
import { defaultConf } from "../../../defaultConf";

const FILE = "stacktrace.js";

const log = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    devTools: false,
    format: false,
    clone: false,
    stackTraceAsync: false,
  });
});

afterAll(() => setDefaults(defaultConf));

beforeEach(() => log.mockClear());

// describe("correct stack frame", () => {
//   test("should log with v()", () => {
//     logV.with({ stackTrace: ["func", "file"] })();
//     expect(log.mock.calls[0][1]).toBe(`at Object.<anonymous> (${FILE})`);
//   });
//   test("should log with f()", () => {
//     const fn = () => {}; // eslint-disable-line no-empty-function
//     logF.with({ stackTrace: ["func", "file"] })(fn)();
//     expect(log.mock.calls[0][1]).toBe(`at Object.<anonymous> (${FILE})`);
//   });
// });

describe("stackTrace option", () => {
  // describe("full stack trace data", () => {
  //   afterEach(() => {
  //     expect(log.mock.calls[0][1]).toEqual(
  //       expect.stringMatching(
  //         new RegExp(`at Object\\.<anonymous> \\(${FILE}:\\d+:\\d+\\)`, "u")
  //       )
  //     );
  //   });
  //   test("should log with 'true'", () => {
  //     logV.with({ stackTrace: true })();
  //   });
  //   test("should log with a full array of items", () => {
  //     logV.with({ stackTrace: ["func", "file", "line", "col"] })();
  //   });
  // });

  describe("no stack trace data", () => {
    afterEach(() => {
      expect(log).toBeCalledWith("logV()", []);
    });
    test("should not log with 'false'", () => {
      logV.with({ stackTrace: false })();
    });
    test("should not log with an empty array", () => {
      logV.with({ stackTrace: [] })();
    });
  });
});

// describe("stackTraceShift option", () => {
//   test("should allow to select a frame", () => {
//     function testFunc() {
//       logV.with({ stackTrace: ["func"], stackTraceShift: 1 })();
//     }
//     testFunc();
//     expect(log.mock.calls[0][1]).toBe("at Object.testFunc");
//   });
// });
