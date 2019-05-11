// @flow

import { init, last, map, type } from "ramda";

import type { Conf } from "./types/conf";
import { ConfArg, ModeArg, api } from "./tools/util/api";
import type { Modes } from "./types/modes";
import { errInvalidConfType } from "./errors/misc";
import { error } from "./errors/util";
import { globalConf } from "./state";
import * as _mute from "./tools/mute";
import * as _time from "./tools/time";
import * as _watch from "./tools/watcher";

const tool = (fn, modeGist: $Shape<Modes>) => api(fn, new ModeArg(modeGist));

export type API = typeof tools;

function setDefaults(conf: mixed): void {
  if (type(conf) !== "Object") {
    error(errInvalidConfType("setDefault"));
  }
  Object.assign(globalConf, ((conf: any): $Shape<Conf>));
}

function instance(...args: *[]): API {
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

const logV = tool(_watch.val, { task: "logV" });
const logF = tool(_watch.fn, { task: "logF" });

const logV_ = tool(_watch.val, { task: "logV_", quiet: true });
const logF_ = tool(_watch.fn, { task: "logF_", quiet: true });

const debV = tool(_watch.val, { task: "debV", deb: true });
const debF = tool(_watch.fn, { task: "debF", deb: true });

const v = tool(logV, { task: "v" });
const f = tool(logF, { task: "f" });

const v_ = tool(logV_, { task: "v_" });
const f_ = tool(logF_, { task: "f_" });

const time = tool(_time.time, { task: "time" });
const timeEnd = tool(_time.timeEnd, { task: "timeEnd" });

const stopwatch = tool(_time.stopwatch, { task: "stopwatch" });
const lap = tool(_time.lap, { task: "lap" });

const timeF = tool(_time.timeFn, { task: "timeF" });
const timeRun = tool(_time.timeRun, { task: "timeRun" });

const unmute = tool(_mute.unmute, { task: "unmute" });
const mute = tool(_mute.mute, { task: "mute" });
const unmuteF = tool(_mute.unmuteF, { task: "unmuteF" });
const unmuteRun = tool(_mute.unmuteRun, { task: "unmuteRun" });

const tools = {
  setDefaults,
  instance,
  logV,
  logF,
  logV_,
  logF_,
  debV,
  debF,
  v,
  f,
  v_,
  f_,
  time,
  timeEnd,
  stopwatch,
  lap,
  timeF,
  timeRun,
  unmute,
  mute,
  unmuteF,
  unmuteRun
};

export {
  setDefaults,
  instance,
  logV,
  logF,
  logV_,
  logF_,
  debV,
  debF,
  v,
  f,
  v_,
  f_,
  time,
  timeEnd,
  stopwatch,
  lap,
  timeF,
  timeRun,
  unmute,
  mute,
  unmuteF,
  unmuteRun
};

export default {
  setDefaults,
  instance,
  logV,
  logF,
  logV_,
  logF_,
  debV,
  debF,
  v,
  f,
  v_,
  f_,
  time,
  timeEnd,
  stopwatch,
  lap,
  timeF,
  timeRun,
  unmute,
  mute,
  unmuteF,
  unmuteRun
};
