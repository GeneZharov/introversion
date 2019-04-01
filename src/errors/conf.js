// @flow

export function unknownOpt(name: string) {
  return new Error(`Unknown option ${name}`);
}

export function invalidPrintOpt() {
  return new Error('"print" option must be a function');
}

export function invalidTimerOpt() {
  return new Error('Invalid "timer" option value');
}

export function invalidFormatOpt() {
  return new Error('"format" option must be boolean');
}

export function invalidShowHiddenOpt() {
  return new Error('"showHidden" option must be boolean');
}

export function invalidDepthOpt() {
  return new Error('"depth" option must be a number');
}

export function invalidColorOpt() {
  return new Error('"color" option must be boolean');
}

export function invalidIdOpt() {
  return new Error('"id" option must be a string');
}

export function invalidGuardOpt() {
  return new Error('"guard" option must be a number');
}

export function invalidRepeatOpt() {
  return new Error('"repeat" option must be a number or a string');
}
