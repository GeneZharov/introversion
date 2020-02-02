// @flow

export type StackTraceItem = "func" | "file" | "line" | "col";

export type StackFrame = {
  functionName?: string,
  fileName?: string,
  lineNumber?: number,
  columnNumber?: number,
  source?: string, // ${functionName}@${fileName}:${lineNumber}${columnNumber}
  ...
};

export type Print = (...xs: mixed[]) => void;

export type Auto<T> = "auto" | T;

export type TimerOption = "performance" | "console" | "date" | (() => number);

export type Conf = {
  timer: Auto<TimerOption>,
  log: Print,
  warn: Print,
  clone: Auto<boolean>,
  errorHandling: "warn" | "throw",
  devTools: Auto<boolean>,
  dev: boolean,

  // formatting
  format: Auto<boolean>,
  formatErrors: Auto<boolean>,
  highlight: Auto<boolean>,
  inspectOptions: Auto<util$InspectOptions>,
  precision: number,

  // stacktrace
  stackTrace: Auto<boolean | StackTraceItem[]>,
  stackTraceAsync: Auto<boolean>,
  stackTraceShift: Auto<number>,

  // in-place options
  id: mixed,
  guard: number,
  repeat: number | string,

  ...
};
