// @flow

export function errInvalidTimerReturn(): string[] {
  return [`Ivalid "timer" return value`];
}

export function errPerformanceNotAvail(): string[] {
  return ["performance.now() is not callable"];
}

export function errConsoleNotAvail(): string[] {
  return ["console.time/timeEnd() are not callable"];
}

export function errFormatNotAvail(): string[] {
  return ['format: true is not available in the "dist" build'];
}

export function errFormatErrorsNotAvail(): string[] {
  return ['formatErrors: true is not available in the "dist" build'];
}

// Console Errors
// --------------

export function errExtraArgsNotAllowed() {
  return [
    'Extra arguments are not allowed with timer: "console"',
    "",
    "Workaround:",
    "- remove extra arguments",
    '- alter the "timer" option',
    '- enable the "format" option'
  ];
}

export function errRepeatNotAllowed() {
  return ['"repeat" option is not allowed with timer: "console"'];
}

export function errStackTraceAsyncNotAllowed() {
  return ['stackTraceAsync: true is not compatible with timer: "console"'];
}
