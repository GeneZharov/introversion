// @flow

import { always, memoizeWith } from "ramda";

import type { Conf } from "../../types/conf";
import { defaultConf } from "../../conf";
import {
  errInvalidClone,
  errInvalidDev,
  errInvalidFormat,
  errInvalidGuard,
  errInvalidHighlight,
  errInvalidInspectOptions,
  errInvalidLog,
  errInvalidPrecision,
  errInvalidRepeat,
  errInvalidStackTrace,
  errInvalidStackTraceAsync,
  errInvalidStackTraceShift,
  errInvalidTimer,
  errInvalidWarn,
  errUnknownOpt
} from "../../errors/options";
import { error, warning } from "../../errors/util";
import { once } from "../func/once";
import {
  validClone,
  validDev,
  validFormat,
  validGuard,
  validHighlight,
  validInspectOptions,
  validLog,
  validPrecision,
  validRepeat,
  validStackTrace,
  validStackTraceAsync,
  validStackTraceShift,
  validTimer,
  validWarn
} from "./validateOptions";

const warnOnce = (msg: () => string[]) => once(conf => warning(conf, msg()));

const validators = {
  timer: [validTimer, warnOnce(errInvalidTimer)],
  log: [validLog, warnOnce(errInvalidLog)],
  warn: [validWarn, _ => error(errInvalidWarn())],
  clone: [validClone, warnOnce(errInvalidClone)],
  precision: [validPrecision, warnOnce(errInvalidPrecision)],
  dev: [validDev, warnOnce(errInvalidDev)],
  stackTrace: [validStackTrace, warnOnce(errInvalidStackTrace)],
  stackTraceAsync: [validStackTraceAsync, warnOnce(errInvalidStackTraceAsync)],
  stackTraceShift: [validStackTraceShift, warnOnce(errInvalidStackTraceShift)],
  format: [validFormat, _ => error(errInvalidFormat())],
  highlight: [validHighlight, warnOnce(errInvalidHighlight)],
  inspectOptions: [validInspectOptions, warnOnce(errInvalidInspectOptions)],
  id: [always, _ => {}],
  guard: [validGuard, warnOnce(errInvalidGuard)],
  repeat: [validRepeat, warnOnce(errInvalidRepeat)]
};

const warnUnknownOpt = memoizeWith(
  (_, name) => name,
  (conf, name) => warning(((conf: any): Conf), errUnknownOpt(name))
);

export function validateConf(conf: Object): Conf {
  // Tried to avoid function calls in this function (including
  // R.mapObjIndexed()) because it increases stack trace depth and hides user
  // calls in that stack.
  const _conf = {};
  for (let name in conf) {
    if (name in validators) {
      const [valid, onInvalid] = validators[name];
      if (valid(conf[name])) {
        _conf[name] = conf[name];
      } else {
        onInvalid(conf);
        _conf[name] = defaultConf[name];
      }
    } else {
      warnUnknownOpt(conf, name);
    }
  }
  return _conf;
}
