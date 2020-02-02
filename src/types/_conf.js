// @flow

// Normalized Configuration

import {
  type Auto,
  type Conf,
  type StackTraceItem,
  type TimerOption,
} from "./conf";

export type _Conf = {
  ...$Diff<$Exact<Conf>, { devTools: Auto<boolean>, ... }>,

  timer: TimerOption,
  clone: boolean,
  devTools: boolean,

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
  repeat: number,

  ...
};
