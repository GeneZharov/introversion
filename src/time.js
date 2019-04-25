// @flow

import { isEmpty, range } from "ramda";

import type { Modes } from "./types/modes";
import type { Task } from "./types/_";
import type { TimerOption } from "./types/conf";
import type { _Conf } from "./types/_conf";
import { _warning } from "./errors/util";
import { errInvalidTimerReturn } from "./errors/options-runtime";
import { errNotCallableLastArg } from "./errors/_";
import { genTimerID } from "./util/app/id";
import { getGuard, saveGuard } from "./util/app/guard";
import { logTime } from "./util/app/logging";
import { parseUserArgs, withApi } from "./util/app/api";
import { specifiedThis } from "./util/func/specifiedThis";
import { state } from "./state";

const DEFAULT_ID = "default";
const STOPWATCH_ID = "lap";

function selectFuncName(method: boolean, task: Task): string {
  if (task === "timeFn") {
    return method ? "timeM" : "timeF";
  } else {
    return task;
  }
}

function normalize(
  args: mixed[],
  conf: _Conf,
  modes: $Shape<Modes>,
  task: Task
): {
  measure: boolean,
  name: string,
  _args: {
    extras: mixed[],
    val: mixed[],
    obj: mixed[]
  }
} {
  const name = selectFuncName(modes.method, task);
  const _args = parseUserArgs(modes, args);
  const guard = getGuard(conf.id, conf.guard);
  const measure = guard > 0 && !(modes.mute && state.muted);
  saveGuard(conf.id, guard);
  return { measure, name, _args };
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
    state.timers.set(id, getTime(conf));
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
      return NaN;
    } else {
      return stop - start;
    }
  }
}

export const time = withApi(
  "time",
  (args, conf, modes, task): void => {
    const {
      measure,
      _args: {
        val: [timerID = DEFAULT_ID]
      }
    } = normalize(args, conf, modes, task);
    if (measure) {
      start(conf, timerID);
    }
  }
);

export const timeEnd = withApi(
  "timeEnd",
  (args, conf, modes, task): void => {
    const {
      measure,
      name,
      _args: {
        extras,
        val: [timerID = DEFAULT_ID]
      }
    } = normalize(args, conf, modes, task);
    if (measure) {
      const ellapsed = stop(conf, timerID);
      const _args = conf.timer === "console" ? extras : args;
      logTime(name, conf, 4, _args, ellapsed);
    }
  }
);

export const timeFn = withApi("timeFn", (args, conf, modes, task) => {
  return function(..._args: mixed[]): any {
    const {
      measure,
      name,
      _args: { extras, val, obj }
    } = normalize(args, conf, modes, task);
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
      logTime(name, conf, 3, extras, ellapsed);
      return result;
    } else {
      return (val[0]: Function).apply(self, _args);
    }
  };
});

export const timeRun = withApi(
  "timeRun",
  (args, conf, modes, task): any => {
    const {
      measure,
      name,
      _args: { extras, val }
    } = normalize(args, conf, modes, task);
    if (typeof val[0] !== "function") {
      _warning(conf, errNotCallableLastArg(task));
    } else {
      if (measure) {
        const timerID = genTimerID(conf.id);
        start(conf, timerID);
        const [result] = range(0, conf.repeat).map(_ => (val[0]: Function)());
        const ellapsed = stop(conf, timerID);
        logTime(name, conf, 4, extras, ellapsed);
        return result;
      } else {
        return (val[0]: Function)();
      }
    }
  }
);

export const stopwatch = withApi(
  "stopwatch",
  (args, conf, modes, task): void => {
    const { measure } = normalize(args, conf, modes, task);
    if (measure) {
      start(conf, STOPWATCH_ID);
    }
  }
);

export const lap = withApi(
  "lap",
  (args, conf, modes, task): void => {
    const { measure, name } = normalize(args, conf, modes, task);
    if (measure) {
      const ellapsed = stop(conf, STOPWATCH_ID);
      logTime(name, conf, 4, args, ellapsed);
      start(conf, STOPWATCH_ID);
    }
  }
);
