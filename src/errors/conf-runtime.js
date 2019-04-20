// @flow

export function invalidTimerReturn() {
  return new Error(`Ivalid "timer" option return value`);
}

export function performanceNotAvail() {
  return new Error("performance.now() is not callable");
}

export function extraArgsNotAllowed() {
  return new Error(
    'Extra arguments are not acceptable with the console timer. Ways to solve the issue: 1. remove extra arguments; 2. alter the "timer" option; 3. enable the "format" option.'
  );
}

// Compatibility Errors
// --------------------

export function repeatNotAllowed() {
  return new Error('"repeat" option is not compatible with the console timer');
}

export function stackTraceAsyncNotAllowed() {
  return new Error(
    '"stackTraceAsync" option is not compatible with the console timer'
  );
}
