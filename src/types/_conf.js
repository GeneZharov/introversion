// @flow
// Normalized Configuration

import type { Conf, StackTraceItem, TimerOption } from "./conf";

export type _Conf = {
  ...$Exact<Conf>,

  timer: TimerOption,
  clone: boolean,

  // stacktrace
  stackTrace: StackTraceItem[],
  stackTraceAsync: boolean[],
  stackTraceShift: number,

  // formatting
  format: boolean,
  formatErrors: boolean,
  highlight: boolean,
  inspectOptions: util$InspectOptions,

  // in-place options
  repeat: number
};
