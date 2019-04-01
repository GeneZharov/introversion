// @flow

import rangeStep from "lodash/fp/rangeStep";
import toString from "lodash/fp/toString";

import type { Conf, Timer } from "./types";
import { invalidTimerReturn } from "./errors/conf-runtime";
import { logTime } from "./util/logging";
import { makeID, makeCallID } from "./util/id";
import {
  notCallableLastArg,
  invalidTimeID,
  repeatNotAllowed
} from "./errors/compatibility";
import { parseArgs, parseUserArgs } from "./util/api";
import { parseSuffix } from "./util/suffix";
import { state } from "./state";

export const STOPWATCH_ID = makeID("stopwatch");

const isPerfAvail =
  typeof performance === "object" &&
  performance !== null &&
  typeof performance.now === "function";

const isConsoleAvail = console && typeof console.log === "function";

function normalizeOptions(
  conf: Conf
): {
  id: mixed,
  repeat: number,
  timer: Timer
} {
  const timer =
    conf.timer !== "auto"
      ? conf.timer
      : isPerfAvail
      ? "performance"
      : isConsoleAvail
      ? "console"
      : "date";
  const id = timer === "console" ? toString(conf.id) : conf.id;
  const repeat =
    typeof conf.repeat === "string" ? parseSuffix(conf.repeat) : conf.repeat;
  if (timer === "console" && repeat > 1) {
    throw new repeatNotAllowed();
  }
  return { id, repeat, timer };
}

function genTask(
  args: mixed[]
): {
  mute: boolean,
  conf: Conf,
  userArgs: mixed[],
  _conf: {
    id: mixed,
    repeat: number,
    timer: Timer
  },
  _userArgs: {
    extras: mixed[],
    val: mixed,
    self: mixed
  }
} {
  const { modes, conf, userArgs } = parseArgs(args);
  const _userArgs = parseUserArgs(modes, userArgs);
  const _conf = normalizeOptions(conf);
  const mute = modes.mute && state.muted;
  return { mute, conf, userArgs, _conf, _userArgs };
}

function getTime(src: Timer): number {
  if (src === "performance") {
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

function start(src: Timer, id: string): void {
  if (src === "console") {
    console.time(id);
  } else {
    state.timers.set(id, getTime(src));
  }
}

function stop(src: Timer, id: string): number {
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

export function time(...args: mixed[]): void {
  const {
    mute,
    _conf: { timer },
    _userArgs: { val: id }
  } = genTask(args);
  if (!mute) {
    if (typeof id === "string") {
      start(timer, id);
    } else {
      throw invalidTimeID();
    }
  }
}

export function timeEnd(...args: mixed[]): void {
  const {
    mute,
    conf,
    userArgs,
    _conf: { timer },
    _userArgs: { val: id }
  } = genTask(args);
  if (!mute) {
    if (typeof id === "string") {
      const ellapsed = stop(timer, id);
      logTime(conf, timer, userArgs, id, ellapsed);
    } else {
      throw invalidTimeID();
    }
  }
}

export function timeFn(...args: any[]) {
  return (..._args: mixed[]): any => {
    const {
      mute,
      conf,
      _conf: { timer, repeat },
      _userArgs: { extras, val, self }
    } = genTask(args);
    if (typeof val !== "function") {
      throw notCallableLastArg();
    } else {
      if (mute) {
        return (val: Function).apply(self, _args);
      } else {
        const id = conf.id || makeCallID();
        start(timer, id);
        const [result] = rangeStep(1, 0, repeat).map(_ =>
          (val: Function).apply(self, _args)
        );
        const ellapsed = stop(timer, id);
        logTime(conf, timer, extras, id, ellapsed / repeat);
        return result;
      }
    }
  };
}

export function timeRun<T>(...args: any[]): any {
  const {
    mute,
    conf,
    _conf: { timer, repeat },
    _userArgs: { extras, val }
  } = genTask(args);
  if (typeof val !== "function") {
    throw notCallableLastArg();
  } else {
    if (mute) {
      return (val: Function)();
    } else {
      const id = conf.id || makeCallID();
      start(timer, id);
      const [result] = rangeStep(1, 0, repeat).map(_ => (val: Function)());
      const ellapsed = stop(timer, id);
      logTime(conf, timer, extras, id, ellapsed / repeat);
      return result;
    }
  }
}

export function stopwatch(...args: mixed[]): void {
  const {
    mute,
    _conf: { timer }
  } = genTask(args);
  if (!mute) start(timer, STOPWATCH_ID);
}

export function lap(...args: any[]): void {
  const {
    mute,
    conf,
    userArgs,
    _conf: { timer }
  } = genTask(args);
  if (!mute) {
    const ellapsed = stop(timer, STOPWATCH_ID);
    logTime(conf, timer, userArgs, conf.id || STOPWATCH_ID, ellapsed);
    start(timer, STOPWATCH_ID);
  }
}
