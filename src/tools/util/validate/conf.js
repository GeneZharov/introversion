// @flow

import type { Conf } from "../../../types/conf";
import { defaultConf } from "../../../defaultConf";
import {
  errInvalidClone,
  errInvalidDev,
  errInvalidDevTools,
  errInvalidErrorHandling,
  errInvalidFormat,
  errInvalidFormatErrors,
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
} from "../../../errors/options";
import { error, warning } from "../../../errors/util";
import {
  validClone,
  validDev,
  validDevTools,
  validErrorHandling,
  validFormat,
  validFormatErrors,
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
} from "./options";

const onErr = msg => () => error(msg());
const onWarn = msg => o => warning(o, msg());

const validators = {
  timer: [validTimer, onWarn(errInvalidTimer)],
  log: [validLog, onWarn(errInvalidLog)],
  warn: [validWarn, onErr(errInvalidWarn)],
  clone: [validClone, onWarn(errInvalidClone)],
  errorHandling: [validErrorHandling, onErr(errInvalidErrorHandling)],
  devTools: [validDevTools, onErr(errInvalidDevTools)],
  dev: [validDev, onWarn(errInvalidDev)],
  format: [validFormat, onErr(errInvalidFormat)],
  formatErrors: [validFormatErrors, onErr(errInvalidFormatErrors)],
  highlight: [validHighlight, onWarn(errInvalidHighlight)],
  inspectOptions: [validInspectOptions, onWarn(errInvalidInspectOptions)],
  precision: [validPrecision, onWarn(errInvalidPrecision)],
  stackTrace: [validStackTrace, onWarn(errInvalidStackTrace)],
  stackTraceAsync: [validStackTraceAsync, onWarn(errInvalidStackTraceAsync)],
  stackTraceShift: [validStackTraceShift, onWarn(errInvalidStackTraceShift)],
  id: [_ => true, _ => {}],
  guard: [validGuard, onWarn(errInvalidGuard)],
  repeat: [validRepeat, onWarn(errInvalidRepeat)]
};

export function validateConf(conf: Object): Conf {
  // Tried to avoid extra function calls during validation (even replaced
  // R.mapObjIndexed() with for-in) because it increases the depth of a stack
  // trace and conceals user calls in that stack.
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
      warning(((conf: any): Conf), errUnknownOpt(name));
    }
  }
  return _conf;
}
