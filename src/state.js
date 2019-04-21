// @flow

import type { Conf } from "./types/conf";
import type { State } from "./types/state";
import { detectReactNative } from "./util/detect/detectReactNative";
import { detectTerminal } from "./util/detect/detectTerminal";

export let globalConf: Conf = {
  timer: "auto",
  print: (...xs) => console.log(...xs),
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

export let state: State = {
  muted: true, // Whether muted watchers are disabled
  guard: new Map(),
  timers: new Map()
};
