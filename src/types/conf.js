// @flow

export type StackTraceItem = "func" | "file" | "line" | "col";

export type AutoBoolean = "auto" | boolean;

export type Print = (...xs: mixed[]) => void;

export type TimerOption =
  | "auto"
  | "performance"
  | "console"
  | "date"
  | (() => number);

export type ErrorHandlingOption = "warn" | "throw";

export type StackFrame = {
  functionName?: string,
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
  source?: string // ${functionName}@${fileName}:${lineNumber}${columnNumber}
};

export type Conf = {
  timer: TimerOption,
  log: Print,
  warn: Print,
  clone: AutoBoolean,
  errorHandling: ErrorHandlingOption,
  dev: boolean,

  // stacktrace
  stackTrace: boolean | StackTraceItem[],
  stackTraceAsync: AutoBoolean,
  stackTraceShift: number,

  // formatting
  format: AutoBoolean,
  highlight: boolean,
  inspectOptions: util$InspectOptions,
  precision: number,

  // in-place options
  id: mixed,
  guard: number,
  repeat: number | string
};
