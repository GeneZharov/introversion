// @flow

import type { Conf, Modes } from "./types";
import { notCallableLastArg, requiredIdOption } from "./errors/compatibility";
import { logFn, logVal } from "./util/logging";
import { parseArgs, parseUserArgs } from "./util/api";
import { state } from "./state";

function chooseBehavior(
  modes: $Shape<Modes>,
  conf: Conf
): {
  log: boolean,
  deb: boolean
} {
  function getGuard(id: mixed): number {
    if (conf.guard === Infinity) {
      return Infinity;
    } else {
      if (!id) throw requiredIdOption();
      const guard = state.guard.get(id);
      return typeof guard === "undefined" ? conf.guard : guard;
    }
  }
  function saveGuard(id: mixed, guard: number): void {
    if (0 < guard && guard < Infinity) {
      state.guard.set(id, guard - 1);
    }
  }
  if (modes.mute && state.muted) {
    return { log: false, deb: false };
  } else {
    const guard = getGuard(conf.id);
    saveGuard(conf.id, guard);
    return guard
      ? { log: !modes.deb, deb: modes.deb }
      : { log: false, deb: false };
  }
}

function genTask(
  args: mixed[]
): {
  conf: Conf,
  log: boolean,
  deb: boolean,
  quiet: boolean,
  extras: mixed[],
  val: *,
  self: mixed
} {
  const { modes, conf, userArgs } = parseArgs(args);
  const { extras, val, self } = parseUserArgs(modes, userArgs);
  const { log, deb } = chooseBehavior(modes, conf);
  return {
    conf,
    log,
    deb,
    extras,
    val,
    self,
    quiet: modes.quiet
  };
}

export function val(...args: mixed[]): any {
  const { conf, log, deb, quiet, extras, val } = genTask(args);
  if (log) logVal(conf, quiet, extras, val);
  if (deb) debugger;
  return val;
}

export function fn(..._args: any[]) {
  return (...args: mixed[]): any => {
    const { conf, log, deb, quiet, extras, val, self } = genTask(_args);
    if (typeof val !== "function") {
      throw notCallableLastArg();
    }
    try {
      if (deb) debugger;
      const result = (val: Function).apply(self, args); // <-- Your function
      if (log) logFn(conf, false, quiet, extras, args, result);
      return result;
    } catch (error) {
      if (log) logFn(conf, true, quiet, extras, args, error);
      throw error;
    }
  };
}
