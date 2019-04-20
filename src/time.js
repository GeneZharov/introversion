// @flow

import { range } from "ramda";

import type { Modes } from "./types/modes";
import type { Task } from "./types/_";
import type { TimerOption } from "./types/conf";
import type { _Conf } from "./types/_conf";
import { detectPerformance } from "./util/detect/detectPerformance";
import { getGuard, saveGuard } from "./util/app/guard";
import { invalidTimerReturn, performanceNotAvail } from "./errors/conf-runtime";
import { logTime } from "./util/app/logging";
import { makeID, makeCallID } from "./util/app/id";
import { notCallableLastArg } from "./errors/_";
import { parseUserArgs, withApi } from "./util/app/api";
import { state } from "./state";

export const STOPWATCH_ID = makeID("stopwatch");

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
    self: mixed
  }
} {
  const name = selectFuncName(modes.method, task);
  const _args = parseUserArgs(modes, args);
  const guard = getGuard(conf.id, conf.guard);
  const measure = guard > 0 && !(modes.mute && state.muted);
  saveGuard(conf.id, guard);
  return { measure, name, _args };
}

function getTime(src: TimerOption): number {
  if (src === "performance") {
    if (!detectPerformance()) {
      throw performanceNotAvail();
    }
    return performance.now();
  } else if (src === "date") {
    return Date.now();
  } else if (typeof src === "function") {
    const t = src();
    if (typeof t !== "number" || isNaN(t)) {
      throw invalidTimerReturn();
    }
    return t;
  } else {
    throw new Error();
  }
}

function start(src: TimerOption, id: mixed): void {
  if (src === "console") {
    console.time((id: any));
  } else {
    state.timers.set(id, getTime(src));
  }
}

function stop(src: TimerOption, id: mixed): number {
  if (src === "console") {
    return NaN;
  } else {
    const start = state.timers.get(id);
    state.timers.delete(id);
    const stop = getTime(src);
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
        val: [timerID]
      }
    } = normalize(args, conf, modes, task);
    if (measure) {
      start(conf.timer, timerID);
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
        val: [timerID]
      }
    } = normalize(args, conf, modes, task);
    if (measure) {
      const ellapsed = stop(conf.timer, timerID);
      logTime(name, conf, 4, args, timerID, ellapsed);
    }
  }
);

export const timeFn = withApi("timeFn", (args, conf, modes, task) => {
  return (..._args: mixed[]): any => {
    const {
      measure,
      name,
      _args: { extras, val, self }
    } = normalize(args, conf, modes, task);
    if (typeof val[0] !== "function") {
      throw notCallableLastArg(task);
    } else {
      if (measure) {
        const id = conf.id || makeCallID();
        start(conf.timer, id);
        const [result] = range(0, conf.repeat).map(_ =>
          (val[0]: Function).apply(self, _args)
        );
        const ellapsed = stop(conf.timer, id);
        logTime(name, conf, 3, extras, id, ellapsed);
        return result;
      } else {
        return (val[0]: Function).apply(self, _args);
      }
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
      throw notCallableLastArg(task);
    } else {
      if (measure) {
        const id = conf.id || makeCallID();
        start(conf.timer, id);
        const [result] = range(0, conf.repeat).map(_ => (val[0]: Function)());
        const ellapsed = stop(conf.timer, id);
        logTime(name, conf, 4, extras, id, ellapsed);
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
      start(conf.timer, STOPWATCH_ID);
    }
  }
);

export const lap = withApi(
  "lap",
  (args, conf, modes, task): void => {
    const { measure, name } = normalize(args, conf, modes, task);
    if (measure) {
      const ellapsed = stop(conf.timer, STOPWATCH_ID);
      logTime(name, conf, 4, args, STOPWATCH_ID, ellapsed);
      start(conf.timer, STOPWATCH_ID);
    }
  }
);
