// @flow

import type { Conf } from "./types";
import { ModesArg, api } from "./util/api";
import { globalConf } from "./state";
import { validateConf } from "./util/validateConf";
import * as _mute from "./mute";
import * as _time from "./time";
import * as _watcher from "./watcher";

export function config(conf: $Shape<Conf>): void {
  validateConf(conf);
  Object.assign(globalConf, conf);
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

export default {
  config,

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
