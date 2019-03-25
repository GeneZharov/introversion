// @flow

import type { Conf } from "./types";
import { globalConf } from "./state";

export * from "./watchers";
export * from "./mute";

import { v, f, m, V, F, M, v_, f_, m_ } from "./watchers";
import { unmute, mute, unmuteF, unmuteRun } from "./mute";

function config(conf: $Shape<Conf>): void {
  Object.assign(globalConf, conf);
}

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
  unmute,
  mute,
  unmuteF,
  unmuteRun
};
