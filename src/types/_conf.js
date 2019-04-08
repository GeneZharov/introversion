// @flow
// Normalized Configuration

import type { Conf, StackTraceItem } from "./conf";

export type _TimerOption = "performance" | "console" | "date" | (() => number);

export type _Conf = {
  ...$Exact<Conf>,
  repeat: number,
  timer: _TimerOption,
  stackTrace: StackTraceItem[],
  format: boolean
};
