// @flow

export type TimerOption =
  | "auto"
  | "performance"
  | "console"
  | "date"
  | (() => number);

export type CloneOption = "auto" | boolean;

export type StackTraceItem = "func" | "file" | "line" | "col";

export type FormatOption = "auto" | boolean;

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
  clone: CloneOption,
  dev: boolean,

  // stacktrace
  stackTrace: boolean | StackTraceItem[],
  stackTraceAsync: boolean,
  stackTraceShift: number,

  // formatting
  format: FormatOption,
  highlight: boolean,
  inspectOptions: util$InspectOptions,

  // in-place options
  id: mixed,
  guard: number,
  repeat: number | string
};
