// @flow

import { expectedFuncArg } from "./errors/_";
import { state } from "./state";
import { withApi } from "./util/app/api";

export function mute() {
  state.muted = true;
}

export function unmute() {
  state.muted = false;
}

export const unmuteF = withApi("unmuteF", (args, conf, modes, task) => {
  if (!args.length || typeof args[0] !== "function") {
    throw expectedFuncArg(task);
  }
  const [fn] = args;
  return (...args: mixed[]) => {
    state.muted = false;
    const res = fn.apply(this, args);
    state.muted = true;
    return res;
  };
});

export const unmuteRun = withApi("unmuteRun", (args, conf, modes, task) => {
  if (!args.length || typeof args[0] !== "function") {
    throw expectedFuncArg(task);
  }
  const [action] = args;
  state.muted = false;
  const res = action();
  state.muted = true;
  return res;
});
