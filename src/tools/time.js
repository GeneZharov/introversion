// @flow

import { isEmpty, range } from "ramda";

import type { Modes } from "../types/modes";
import type { _Conf } from "../types/_conf";
import { _warning } from "../errors/util";
import { errInvalidTimerReturn } from "../errors/options-runtime";
import {
  errNotCallableLastArg,
  errTimerIdAlreadyExists,
  errTimerIdDoesNotExist
} from "../errors/misc";
import { genTimerID } from "./util/id";
import { getGuard, saveGuard } from "./util/guard";
import { logTime } from "./util/logging/time";
import { parseUserArgs, withApi } from "./util/api";
import { specifiedThis } from "../util/func/specifiedThis";
import { state } from "../state";

const DEFAULT_ID = "default";
const STOPWATCH_ID = "lap";

function normalize(
  args: mixed[],
  conf: _Conf,
  modes: $Shape<Modes>
): {
  measure: boolean,
  _args: {
    extras: mixed[],
    val: mixed[],
    obj: mixed[]
  }
} {
  const _args = parseUserArgs(modes, args);
  const guard = getGuard(conf.id, conf.guard);
  const measure = guard > 0 && !(modes.mute && state.muted);
  saveGuard(conf.id, guard);
  return { measure, _args };
}

function getTime(conf: _Conf): number {
  const { timer } = conf;
  if (timer === "performance") {
    return performance.now();
  } else if (timer === "date") {
    return Date.now();
  } else if (typeof timer === "function") {
    const t = timer();
    if (typeof t !== "number" || isNaN(t)) {
      _warning(conf, errInvalidTimerReturn());
      return NaN;
    }
    return t;
  } else {
    throw new Error();
  }
}

function start(conf: _Conf, id: mixed): void {
  const { timer } = conf;
  if (timer === "console") {
    console.time((id: any));
  } else {
    if (state.timers.has(id)) {
      _warning(conf, errTimerIdAlreadyExists(id));
    } else {
      state.timers.set(id, getTime(conf));
    }
  }
}

function stop(conf: _Conf, id: mixed): number {
  const { timer } = conf;
  if (timer === "console") {
    console.timeEnd((id: any));
    return NaN;
  } else {
    const start = state.timers.get(id);
    state.timers.delete(id);
    const stop = getTime(conf);
    if (start === undefined) {
      _warning(conf, errTimerIdDoesNotExist(id));
      return NaN;
    } else {
      return stop - start;
    }
  }
}

export const time = withApi(
  (args, conf, modes): void => {
    const {
      measure,
      _args: {
        val: [timerID = DEFAULT_ID]
      }
    } = normalize(args, conf, modes);
    if (measure) {
      start(conf, timerID);
    }
  }
);

export const timeEnd = withApi(
  (args, conf, modes): void => {
    const { task } = modes;
    const {
      measure,
      _args: {
        extras,
        val: [timerID = DEFAULT_ID]
      }
    } = normalize(args, conf, modes);
    if (measure) {
      const ellapsed = stop(conf, timerID);
      const _args = conf.timer === "console" ? extras : args;
      logTime(task, conf, 4, _args, ellapsed);
    }
  }
);

export const timeFn = withApi((args, conf, modes) => {
  return function(..._args: mixed[]): any {
    const { task } = modes;
    const {
      measure,
      _args: { extras, val, obj }
    } = normalize(args, conf, modes);
    if (typeof val[0] !== "function") {
      _warning(conf, errNotCallableLastArg(task));
    }
    const self = specifiedThis(this) || isEmpty(obj) ? this : obj[0];
    if (measure) {
      const timerID = genTimerID(conf.id);
      start(conf, timerID);
      const [result] = range(0, conf.repeat).map(_ =>
        (val[0]: Function).apply(self, _args)
      );
      const ellapsed = stop(conf, timerID);
      logTime(task, conf, 3, extras, ellapsed);
      return result;
    } else {
      return (val[0]: Function).apply(self, _args);
    }
  };
});

export const timeRun = withApi(
  (args, conf, modes): any => {
    const { task } = modes;
    const {
      measure,
      _args: { extras, val }
    } = normalize(args, conf, modes);
    if (typeof val[0] !== "function") {
      _warning(conf, errNotCallableLastArg(task));
    } else {
      if (measure) {
        const timerID = genTimerID(conf.id);
        start(conf, timerID);
        const [result] = range(0, conf.repeat).map(_ => (val[0]: Function)());
        const ellapsed = stop(conf, timerID);
        logTime(task, conf, 4, extras, ellapsed);
        return result;
      } else {
        return (val[0]: Function)();
      }
    }
  }
);

export const stopwatch = withApi(
  (args, conf, modes): void => {
    const { measure } = normalize(args, conf, modes);
    if (measure) {
      state.timers.delete(STOPWATCH_ID); // Reset previous stopwatch
      start(conf, STOPWATCH_ID);
    }
  }
);

export const lap = withApi(
  (args, conf, modes): void => {
    const { task } = modes;
    const { measure } = normalize(args, conf, modes);
    if (measure) {
      const ellapsed = stop(conf, STOPWATCH_ID);
      logTime(task, conf, 4, args, ellapsed);
      start(conf, STOPWATCH_ID);
    }
  }
);
