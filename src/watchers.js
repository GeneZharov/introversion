// @flow

import type { Conf, Modes, Task } from "./types";
import { globalConf, state } from "./state";
import { logFn, logVal } from "./logging";
import { prop } from "./util";

class Arg {}

class ModesArg extends Arg {
  modes: $Shape<Modes>;
  constructor(modes: $Shape<Modes>) {
    super();
    this.modes = modes;
  }
}

class ConfArg extends Arg {
  conf: $Shape<Conf>;
  constructor(conf: $Shape<Conf>) {
    super();
    this.conf = conf;
  }
}

function parseArgs(
  args: *[]
): {
  modes: $Shape<Modes>,
  conf: Conf,
  userArgs: *[]
} {
  const modes = args
    .filter(x => x instanceof ModesArg)
    .reduce((acc, o) => Object.assign({}, acc, o.modes), {});
  const conf = args
    .filter(x => x instanceof ConfArg)
    .reduce((acc, o) => Object.assign({}, acc, o.conf), globalConf);
  const userArgs = args.filter(
    x => x === null || x === undefined || !(x instanceof Arg)
  );
  return { modes, conf, userArgs };
}

function parseUserArgs(
  modes: $Shape<Modes>,
  args: *[]
): {
  extras: mixed[],
  val: mixed,
  self: mixed
} {
  if (modes.method) {
    const obj = args[args.length - 2];
    const method = args[args.length - 1].split(".").slice(1);
    const self = method.slice(0, -1);
    return {
      extras: args.slice(0, -2),
      val: prop(method, obj),
      self: self.length ? prop(self, obj) : obj
    };
  } else {
    return {
      extras: args.slice(0, -1),
      val: args[args.length - 1],
      self: this
    };
  }
}

function chooseBehavior(
  modes: $Shape<Modes>,
  conf: Conf,
  extras: mixed[]
): {
  log: boolean,
  deb: boolean
} {
  function getTimes(id: mixed): number {
    if (conf.times === Infinity) {
      return Infinity;
    } else {
      if (!extras.length) throw new Error("ERRRR");
      const times = state.times.get(id);
      return typeof times === "undefined" ? conf.times : times;
    }
  }
  function saveTimes(id: mixed, times: number): void {
    if (0 < times && times < Infinity) {
      state.times.set(id, times - 1);
    }
  }
  if (modes.mute && state.muted) {
    return { log: false, deb: false };
  } else {
    const [id] = extras;
    const times = getTimes(id);
    saveTimes(id, times);
    return times
      ? { log: !modes.deb, deb: modes.deb }
      : { log: false, deb: false };
  }
}

function genTask(args: mixed[]): Task {
  const { modes, conf, userArgs } = parseArgs(args);
  const { extras, val, self } = parseUserArgs(modes, userArgs);
  const { log, deb } = chooseBehavior(modes, conf, extras);
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

function watchVal(...args: mixed[]): any {
  const { conf, log, deb, quiet, extras, val } = genTask(args);
  if (log) logVal(conf, quiet, extras, val);
  if (deb) debugger;
  return val;
}

function watchFn(..._args: any[]) {
  return (...args: mixed[]): any => {
    const { conf, log, deb, quiet, extras, val, self } = genTask(_args);
    try {
      if (deb) debugger;
      const result = val.apply(self, args); // <-- Your function
      if (log) logFn(conf, false, quiet, extras, args, result);
      return result;
    } catch (error) {
      if (log) logFn(conf, true, quiet, extras, args, error);
      throw error;
    }
  };
}

function watcher(fn, ...args) {
  // This function cause "Recursion limit exceeded" in flow-type, so recursion
  // function calles are masked with "any".
  const _fn = fn.bind(this, ...args);
  _fn.with = (o: $Shape<Conf>) => (watcher: any)(_fn, new ConfArg(o));
  Object.defineProperty(
    _fn,
    "mute",
    ({
      get: () => (watcher: any)(_fn, new ModesArg({ mute: true }))
    }: Object)
  );
  return _fn;
}

export const v = watcher(watchVal);
export const f = watcher(watchFn);
export const m = watcher(watchFn, new ModesArg({ method: true }));
export const V = watcher(watchVal, new ModesArg({ quiet: true }));
export const F = watcher(watchFn, new ModesArg({ quiet: true }));
export const M = watcher(watchFn, new ModesArg({ quiet: true, method: true }));
export const v_ = watcher(watchVal, new ModesArg({ deb: true }));
export const f_ = watcher(watchFn, new ModesArg({ deb: true }));
export const m_ = watcher(watchFn, new ModesArg({ deb: true, method: true }));
