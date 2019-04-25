// @flow

import { isEmpty } from "ramda";

import type { Modes } from "./types/modes";
import type { Task } from "./types/_";
import type { _Conf } from "./types/_conf";
import { _warning, error } from "./errors/util";
import { errNotCallableLastArg } from "./errors/_";
import { getGuard, saveGuard } from "./util/app/guard";
import { logFn, logVal } from "./util/app/logging";
import { parseUserArgs, withApi } from "./util/app/api";
import { specifiedThis } from "./util/func/specifiedThis";
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
    obj: mixed[]
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
  return function(...args: mixed[]): any {
    const {
      log,
      deb,
      name,
      _args: { extras, val, obj }
    } = normalize(_args, conf, modes, task);
    if (typeof val[0] !== "function") {
      _warning(conf, errNotCallableLastArg(task));
      return val[0];
    }
    const self = specifiedThis(this) || isEmpty(obj) ? this : obj[0];
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
