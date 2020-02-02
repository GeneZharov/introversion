// @flow

import { defaultConf } from "./defaultConf";
import { type Conf } from "./types/conf";
import { type State } from "./types/state";

export const globalConf: Conf = Object.assign({}, defaultConf);

export const state: State = {
  muted: true, // Whether muted watchers are disabled
  guard: new Map(),
  timers: new Map(),
};
