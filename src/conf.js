// @flow

import type { Conf, Print } from "./types/conf";
import { detectReactNative } from "./util/detect/detectReactNative";
import { detectTerminal } from "./util/detect/detectTerminal";

export const nativeLog: Print = (...xs) => console.log(...xs);
export const nativeWarn: Print = (...xs) => console.warn(...xs);

export const defaultConf: Conf = {
  timer: "auto",
  log: nativeLog,
  warn: nativeWarn,
  clone: "auto",
  errorHandling: "warn",
  dev: false,

  // stacktrace
  stackTrace: detectReactNative() ? ["func"] : true,
  stackTraceAsync: "auto",
  stackTraceShift: detectReactNative() ? -1 : 0,

  // formatting
  format: "auto",
  formatErrors: "auto",
  highlight: detectTerminal(),
  inspectOptions: { colors: detectTerminal() || detectReactNative() },
  precision: 0,

  // in-place options
  id: undefined,
  guard: Infinity,
  repeat: 1
};
