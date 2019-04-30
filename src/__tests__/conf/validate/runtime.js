// @flow

import { defaultConf } from "../../../defaultConf";
import {
  errExtraArgsNotAllowed,
  errInvalidTimerReturn,
  errPerformanceNotAvail,
  errRepeatNotAllowed,
  errStackTraceAsyncNotAllowed
} from "../../../errors/options-runtime";
import { setDefaults, timeF, timeRun } from "../../..";

const log = jest.fn();
const warn = jest.fn();

const name = 9;
const fn = x => x.name;

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    stackTrace: false,
    format: false,
    clone: false
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => {
  log.mockClear();
  warn.mockClear();
});

test('invalid "timer" result', () => {
  const timer = jest.fn(() => false);
  const conf = { timer };
  const [msg] = errInvalidTimerReturn();
  const result = timeRun.with(conf)(() => fn({ name }));
  expect(result).toBe(name);
  expect(timer.mock.calls.length).toEqual(2);
  expect(log).toBeCalledWith("timeRun()", "NaN ms");
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test("performance not available()", () => {
  function removePerformance() {
    const { now } = performance;
    Object.defineProperty((performance: any), "now", {
      value: null,
      configurable: true
    });
    return now;
  }
  function restorePerformance(now) {
    Object.defineProperty((performance: any), "now", { value: now });
  }
  jest.spyOn(global.console, "time").mockImplementation(() => {});
  jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
  const now = removePerformance();
  const conf = { timer: "performance" };
  const [msg] = errPerformanceNotAvail();
  const result = timeRun.with(conf)(() => fn({ name }));
  expect(result).toBe(name);
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
  restorePerformance(now);
});

// TODO: Can't restore console.time/timeEnd()
//test("console not available()", () => {
//  function removeConsole() {
//    const { time, timeEnd } = console;
//    Object.defineProperty((console: any), "time", {
//      value: null,
//      configurable: true
//    });
//    Object.defineProperty((console: any), "timeEnd", {
//      value: null,
//      configurable: true
//    });
//    return { time, timeEnd };
//  }
//  function restoreConsole(time, timeEnd) {
//    Object.defineProperty((console: any), "time", { value: time });
//    Object.defineProperty((console: any), "timeEnd", { value: timeEnd });
//  }
//  const { time, timeEnd } = removeConsole();
//  const conf = { timer: "console" };
//  const [msg] = errConsoleNotAvail();
//  const result = timeRun.with(conf)(() => fn({ name }));
//  expect(result).toBe(name);
//  expect(warn).toBeCalledWith(expect.stringContaining(msg));
//  restoreConsole(time, timeEnd);
//});

test("extra arguments are not allowed", () => {
  jest.spyOn(global.console, "time").mockImplementation(() => {});
  jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
  const conf = {
    timer: "console",
    format: false
  };
  const [msg] = errExtraArgsNotAllowed();
  const result = timeF.with(conf)(1, 2, fn)({ name });
  expect(result).toBe(name);
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('"repeat" is not allowed', () => {
  jest.spyOn(global.console, "time").mockImplementation(() => {});
  jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
  const conf = {
    timer: "console",
    repeat: 2
  };
  const [msg] = errRepeatNotAllowed();
  const result = timeRun.with(conf)(() => fn({ name }));
  expect(result).toBe(name);
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('"stackTraceAsync" is not allowed', () => {
  jest.spyOn(global.console, "time").mockImplementation(() => {});
  jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
  const conf = {
    timer: "console",
    stackTraceAsync: true
  };
  const [msg] = errStackTraceAsyncNotAllowed();
  const result = timeRun.with(conf)(() => fn({ name }));
  expect(result).toBe(name);
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});
