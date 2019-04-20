// @flow

import {
  extraArgsNotAllowed,
  invalidTimerReturn,
  performanceNotAvail,
  repeatNotAllowed,
  stackTraceAsyncNotAllowed
} from "../../../errors/conf-runtime";
import Introversion from "../../../index";

const In = Introversion.instance({ format: false, clone: false });

const fn = () => {};

test("invalidTimerReturn()", () => {
  const conf = { timer: () => (undefined: any) };
  expect(() => {
    In.timeRun.with(conf)(fn);
  }).toThrow(invalidTimerReturn());
});

test("performanceNotAvail()", () => {
  const now = performance.now;
  Object.defineProperty(performance, "now", {
    value: null,
    configurable: true
  });
  const conf = { timer: "performance" };
  expect(() => {
    In.timeRun.with(conf)(fn);
  }).toThrow(performanceNotAvail());
  Object.defineProperty(performance, "now", { value: now });
});

test("extraArgsNotAllowed()", () => {
  jest.spyOn(global.console, "time").mockImplementation(() => {});
  jest.spyOn(global.console, "timeEnd").mockImplementation(() => {});
  const conf = {
    timer: "console",
    format: false
  };
  expect(() => {
    In.timeF.with(conf)(1, 2, fn)();
  }).toThrow(extraArgsNotAllowed());
});

test("repeatNotAllowed()", () => {
  const conf = {
    timer: "console",
    repeat: 2
  };
  expect(() => {
    In.timeRun.with(conf)(fn);
  }).toThrow(repeatNotAllowed());
});

test("stackTraceAsyncNotAllowed()", () => {
  const conf = {
    timer: "console",
    stackTraceAsync: true
  };
  expect(() => {
    In.timeRun.with(conf)(fn);
  }).toThrow(stackTraceAsyncNotAllowed());
});
