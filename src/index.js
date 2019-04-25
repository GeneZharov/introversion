// @flow

import { init, last, map, type } from "ramda";

import type { Conf } from "./types/conf";
import { ConfArg, ModesArg, api } from "./util/app/api";
import { errInvalidConfType } from "./errors/_";
import { error } from "./errors/util";
import { globalConf } from "./state";
import * as _mute from "./mute";
import * as _time from "./time";
import * as _watcher from "./watcher";

export type API = typeof tools;

export function setDefaults(conf: mixed): void {
  if (type(conf) !== "Object") {
    error(errInvalidConfType("setDefault"));
  }
  Object.assign(globalConf, ((conf: any): $Shape<Conf>));
}

export function instance(...args: *[]): API {
  const _args = init(args);
  const conf = last(args);
  if (type(conf) !== "Object") {
    error(errInvalidConfType("instance"));
  }
  return map(
    f => api(f, ..._args, new ConfArg(((conf: any): $Shape<Conf>))),
    tools
  );
}

export const v = api(_watcher.val);
export const f = api(_watcher.fn);
export const m = api(_watcher.fn, new ModesArg({ method: true }));
export const V = api(_watcher.val, new ModesArg({ quiet: true }));
export const F = api(_watcher.fn, new ModesArg({ quiet: true }));
export const M = api(_watcher.fn, new ModesArg({ quiet: true, method: true }));
export const v_ = api(_watcher.val, new ModesArg({ deb: true }));
export const f_ = api(_watcher.fn, new ModesArg({ deb: true }));
export const m_ = api(_watcher.fn, new ModesArg({ deb: true, method: true }));

export const time = api(_time.time);
export const timeEnd = api(_time.timeEnd);
export const stopwatch = api(_time.stopwatch);
export const lap = api(_time.lap);
export const timeF = api(_time.timeFn);
export const timeM = api(_time.timeFn, new ModesArg({ method: true }));
export const timeRun = api(_time.timeRun);

export const unmute = api(_mute.unmute);
export const mute = api(_mute.mute);
export const unmuteF = api(_mute.unmuteF);
export const unmuteRun = api(_mute.unmuteRun);

const tools = {
  setDefaults,
  instance,

  v,
  f,
  m,
  V,
  F,
  M,
  v_,
  f_,
  m_,

  time,
  timeEnd,
  stopwatch,
  lap,
  timeF,
  timeM,
  timeRun,

  unmute,
  mute,
  unmuteF,
  unmuteRun
};

export default {
  setDefaults,
  instance,

  v,
  f,
  m,
  V,
  F,
  M,
  v_,
  f_,
  m_,

  time,
  timeEnd,
  stopwatch,
  lap,
  timeF,
  timeM,
  timeRun,

  unmute,
  mute,
  unmuteF,
  unmuteRun
};
