// @flow

import { state } from "./state";

export function mute() {
  state.muted = true;
}

export function unmute() {
  state.muted = false;
}

export function unmuteF<T>(fn: (*) => T): (*) => T {
  return function(...args) {
    state.muted = false;
    const res = fn.apply(this, args);
    state.muted = true;
    return res;
  };
}

export function unmuteRun<T>(action: () => T): T {
  state.muted = false;
  const res = action();
  state.muted = true;
  return res;
}
