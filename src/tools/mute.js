// @flow

import { errExpectedFuncArg } from "../errors/misc";
import { _warning } from "../errors/util";
import { state } from "../state";

import { withApi } from "./util/api";

export function mute() {
  state.muted = true;
}

export function unmute() {
  state.muted = false;
}

export const unmuteF = withApi((args, conf, modes) => {
  if (!args.length || typeof args[0] !== "function") {
    _warning(conf, errExpectedFuncArg(modes.task));
    return args[0];
  }
  const [fn] = args;
  return function(...args: mixed[]) {
    state.muted = false;
    const res = fn.apply(this, args);
    state.muted = true;
    return res;
  };
});

export const unmuteV = withApi((args, conf, modes) => {
  if (!args.length || typeof args[0] !== "function") {
    _warning(conf, errExpectedFuncArg(modes.task));
    return args[0];
  }
  const [action] = args;
  state.muted = false;
  const res = action();
  state.muted = true;
  return res;
});
