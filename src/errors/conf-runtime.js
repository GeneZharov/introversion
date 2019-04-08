// @flow

export function invalidTimerReturn() {
  return new Error(`Ivalid "timer" option return value`);
}

export function performanceNotAvail() {
  return new Error("performance.now() is not callable");
}
