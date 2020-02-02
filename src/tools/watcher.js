// @flow

import { errNotCallableLastArg } from "../errors/misc";
import { _warning } from "../errors/util";
import { state } from "../state";
import { type _Conf } from "../types/_conf";
import { type Modes } from "../types/modes";

import { parseUserArgs, withApi } from "./util/api";
import { getGuard, saveGuard } from "./util/guard";
import { logFn } from "./util/logging/fn";
import { logVal } from "./util/logging/val";

function chooseBehavior(
  modes: $Shape<Modes>,
  conf: _Conf
): {
  log: boolean,
  deb: boolean,
  ...
} {
  if (modes.mute && state.muted) {
    return { log: false, deb: false };
  } else {
    const guard = getGuard(conf.id, conf.guard);
    saveGuard(conf.id, guard);
    return guard
      ? {
          log: !modes.deb,
          deb: modes.deb,
        }
      : {
          log: false,
          deb: false,
        };
  }
}

function normalize(
  args: mixed[],
  conf: _Conf,
  modes: $Shape<Modes>
): {
  log: boolean,
  deb: boolean,
  _args: {
    extras: mixed[],
    val: Array<*>,
    ...
  },
  ...
} {
  const { log, deb } = chooseBehavior(modes, conf);
  const _args = parseUserArgs(modes, args);
  return { log, deb, _args };
}

export const val = withApi((args, conf, modes) => {
  const { task, quiet } = modes;
  const {
    log,
    deb,
    _args: { extras, val },
  } = normalize(args, conf, modes);
  const result = val[0];
  if (log) logVal(task, conf, 4, quiet, extras, val);
  if (deb) debugger; // eslint-disable-line no-debugger
  return result; // <-- your value
});

export const fn = withApi((_args, conf, modes) => {
  return function(...args: mixed[]): any {
    const { task, quiet } = modes;
    const {
      log,
      deb,
      _args: { extras, val },
    } = normalize(_args, conf, modes);
    if (typeof val[0] !== "function") {
      _warning(conf, errNotCallableLastArg(task));
      return val[0];
    }
    try {
      const func = (val[0]: Function);
      if (deb) debugger; // eslint-disable-line no-debugger
      const result = func.apply(this, args); // <-- your function
      if (log) logFn(task, conf, 3, false, quiet, extras, args, result);
      return result;
    } catch (error) {
      if (log) logFn(task, conf, 3, true, quiet, extras, args, error);
      throw error;
    }
  };
});
