// @flow

import type { Modes } from "./types/modes";
import type { Task, WatcherTask } from "./types/_";
import type { _Conf } from "./types/_conf";
import { getGuard, saveGuard } from "./util/app/guard";
import { logFn, logVal } from "./util/app/logging";
import { notCallableLastArg } from "./errors/_";
import { parseUserArgs, withApi } from "./util/app/api";
import { state } from "./state";

function modifyFuncName(quiet: boolean, deb: boolean, func: string): string {
  if (quiet) {
    return func.toUpperCase();
  } else if (deb) {
    return func + "_";
  } else {
    return func;
  }
}

function selectFuncName(method: boolean, task: Task): string {
  switch (task) {
    case "val":
      return "v";
    case "fn":
      return method ? "m" : "f";
    default:
      throw new Error();
  }
}

function genFuncName(
  method: boolean,
  quiet: boolean,
  deb: boolean,
  task: Task
): string {
  return modifyFuncName(quiet, deb, selectFuncName(method, task));
}

function chooseBehavior(
  modes: $Shape<Modes>,
  conf: _Conf
): {
  log: boolean,
  deb: boolean
} {
  if (modes.mute && state.muted) {
    return { log: false, deb: false };
  } else {
    const guard = getGuard(conf.id, conf.guard);
    saveGuard(conf.id, guard);
    return guard
      ? {
          log: !modes.deb,
          deb: modes.deb
        }
      : {
          log: false,
          deb: false
        };
  }
}

function normalize(
  args: mixed[],
  conf: _Conf,
  modes: $Shape<Modes>,
  task: Task
): {
  name: string,
  log: boolean,
  deb: boolean,
  _args: {
    extras: mixed[],
    val: *[],
    self: mixed
  }
} {
  const { log, deb } = chooseBehavior(modes, conf);
  const name = genFuncName(modes.method, modes.quiet, deb, task);
  const _args = parseUserArgs(modes, args);
  return { log, deb, name, _args };
}

export const val = withApi("val", (args, conf, modes, task) => {
  const {
    log,
    deb,
    name,
    _args: { extras, val }
  } = normalize(args, conf, modes, task);
  if (log) logVal(name, conf, 4, modes.quiet, extras, val);
  if (deb) debugger;
  return val[0];
});

export const fn = withApi("fn", (_args, conf, modes, task) => {
  return (...args: mixed[]): any => {
    const {
      log,
      deb,
      name,
      _args: { extras, val, self }
    } = normalize(_args, conf, modes, task);
    if (typeof val[0] !== "function") {
      throw notCallableLastArg(task);
    }
    try {
      if (deb) debugger;
      const result = (val[0]: Function).apply(self, args); // <-- Your function
      if (log) logFn(name, conf, 3, false, modes.quiet, extras, args, result);
      return result;
    } catch (error) {
      if (log) logFn(name, conf, 3, true, modes.quiet, extras, args, error);
      throw error;
    }
  };
});
