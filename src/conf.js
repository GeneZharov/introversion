// @flow

import type { Conf, Print } from "./types/conf";
import { detectReactNative } from "./util/detect/detectReactNative";
import { detectTerminal } from "./util/detect/detectTerminal";

export const defaultLog: Print = (...xs) => console.log(...xs);
export const defaultWarn: Print = (...xs) => console.warn(...xs);

export const defaultConf: Conf = {
  timer: "auto",
  log: defaultLog,
  warn: defaultWarn,
  clone: "auto",
  precision: 0,
  dev: false,

  // stacktrace
  stackTrace: true,
  stackTraceAsync: "auto",
  stackTraceShift: detectReactNative() ? 1 : 0,

  // formatting
  format: "auto",
  highlight: detectTerminal(),
  inspectOptions: { colors: detectTerminal() },

  // in-place options
  id: undefined,
  guard: Infinity,
  repeat: 1
};
