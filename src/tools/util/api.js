// @flow

import { last, path } from "ramda";

import type { Conf } from "../../types/conf";
import type { Modes } from "../../types/modes";
import type { _Conf } from "../../types/_conf";
import { globalConf } from "../../state";
import { normalizeConf } from "./normalizeConf";
import { validateConf } from "./validateConf";

export function parseArgs(
  args: *[]
): {
  modes: $Shape<Modes>,
  conf: Conf,
  userArgs: *[]
} {
  const modes = args
    .filter(x => x instanceof ModeArg)
    .reduce((acc, o) => Object.assign({}, acc, o.modes), {});
  const conf = args
    .filter(x => x instanceof ConfArg)
    .reduce((acc, o) => Object.assign({}, acc, o.conf), globalConf);
  const userArgs = args.filter(
    x => x === null || x === undefined || !(x instanceof Arg)
  );
  return { modes, conf, userArgs };
}

export function parseUserArgs(
  modes: $Shape<Modes>,
  args: *[]
): {
  extras: mixed[],
  val: mixed[],
  obj: mixed[]
} {
  if (modes.method) {
    const root = args[args.length - 2];
    const method = args[args.length - 1].split(".").slice(1);
    const obj = method.slice(0, -1);
    return {
      extras: args.slice(0, -2),
      val: [path(method, root)],
      obj: obj.length ? [path(obj, root)] : [root]
    };
  } else {
    return {
      extras: args.slice(0, -1),
      val: args.length ? [last(args)] : [],
      obj: []
    };
  }
}

export class Arg {}

export class ModeArg extends Arg {
  modes: $Shape<Modes>;
  constructor(modes: $Shape<Modes>) {
    super();
    this.modes = modes;
  }
}

export class ConfArg extends Arg {
  conf: $Shape<Conf>;
  constructor(conf: $Shape<Conf>) {
    super();
    this.conf = conf;
  }
}

export function api(fn: *, ...args: mixed[]): * {
  // This function cause "Recursion limit exceeded" in flow-type, so recursion
  // function calls are concealed with "any" type.
  const _fn = fn.bind(this, ...args);
  const muteFn = () => (api: any)(_fn, new ModeArg({ mute: true }));
  const withFn = (conf: $Shape<Conf>) => (api: any)(_fn, new ConfArg(conf));
  _fn.with = withFn;
  Object.defineProperty(_fn, "mute", ({ get: muteFn }: Object));
  return _fn;
}

export function withApi<T>(fn: (*[], _Conf, $Shape<Modes>) => T): (*) => T {
  return (...args) => {
    const { modes, conf, userArgs } = parseArgs(args);
    const _conf = normalizeConf(validateConf(conf), modes.task);
    return fn(userArgs, _conf, modes);
  };
}
