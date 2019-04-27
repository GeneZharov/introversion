// @flow
// Normalized Configuration

import type { Conf, StackTraceItem } from "./conf";

export type _TimerOption = "performance" | "console" | "date" | (() => number);

export type _Conf = {
  ...$Exact<Conf>,
  timer: _TimerOption,
  stackTrace: StackTraceItem[],
  stackTraceAsync: boolean[],
  clone: boolean,
  format: boolean,
  formatErrors: boolean,
  repeat: number
};
