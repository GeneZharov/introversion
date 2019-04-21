// @flow

export function invalidConfType() {
  return new Error("Config must be an object");
}

export function unknownOpt(name: string) {
  return new Error(`Unknown option ${name}`);
}

export function invalidPrintOpt() {
  return new Error('"print" option must be a function');
}

export function invalidPrecisionOpt() {
  return new Error('"precision" option must be a positive number');
}

export function invalidDevOpt() {
  return new Error('"dev" option must be boolean');
}

export function invalidTimerOpt() {
  return new Error('Invalid "timer" option value');
}

export function invalidCloneOpt() {
  return new Error('"clone" option must be boolean');
}

export function invalidStackTraceOpt() {
  return new Error('Invalid "stackTrace" option value');
}

export function invalidStackTraceAsyncOpt() {
  return new Error('"stackTraceAsync" option must be boolean');
}

export function invalidStackTraceShiftOpt() {
  return new Error('"stackTraceShift" option must be a number');
}

export function invalidFormatOpt() {
  return new Error('"format" option must be boolean');
}

export function invalidInspectOptionsOpt() {
  return new Error('"inspectOptions" option must be an object');
}

export function invalidHighlightOpt() {
  return new Error('"highlight" option must be boolean');
}

export function invalidGuardOpt() {
  return new Error('"guard" option must be a number');
}

export function invalidRepeatOpt() {
  return new Error(
    '"repeat" option must be a number or a string, representing a number greater than 0.'
  );
}
