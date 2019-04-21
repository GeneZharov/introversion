// @flow

export type StackTraceItem = "func" | "file" | "line" | "col";

export type AutoBoolean = "auto" | boolean;

export type TimerOption =
  | "auto"
  | "performance"
  | "console"
  | "date"
  | (() => number);

export type StackFrame = {
  functionName?: string,
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
  source?: string // ${functionName}@${fileName}:${lineNumber}${columnNumber}
};

export type Conf = {
  timer: TimerOption,
  print: (...args: mixed[]) => void,
  clone: AutoBoolean,
  precision: number,
  dev: boolean,

  // stacktrace
  stackTrace: boolean | StackTraceItem[],
  stackTraceAsync: AutoBoolean,
  stackTraceShift: number,

  // formatting
  format: AutoBoolean,
  highlight: boolean,
  inspectOptions: util$InspectOptions,

  // in-place options
  id: mixed,
  guard: number,
  repeat: number | string
};
