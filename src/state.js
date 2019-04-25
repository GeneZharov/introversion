// @flow

import type { Conf } from "./types/conf";
import type { State } from "./types/state";
import { defaultConf } from "./conf";

export let globalConf: Conf = Object.assign({}, defaultConf);

export let state: State = {
  muted: true, // Whether muted watchers are disabled
  guard: new Map(),
  timers: new Map()
};
