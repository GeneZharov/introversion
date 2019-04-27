// @flow

import type { Conf } from "../../types/conf";
import type { Task } from "../../types/_";
import type { _Conf } from "../../types/_conf";
import {
  normalizeClone,
  normalizeFormat,
  normalizeFormatErrors,
  normalizeHighlight,
  normalizeId,
  normalizeInspectOptions,
  normalizeRepeat,
  normalizeStackTrace,
  normalizeStackTraceAsync,
  normalizeStackTraceShift,
  normalizeTimer
} from "./normalizeOptions";
import { warning } from "../../errors/util";

export function normalizeConf(conf: Conf, task?: Task): _Conf {
  const [timer, timerE] = normalizeTimer(conf.timer);
  const clone = normalizeClone(conf.clone);

  // stacktrace
  const stackTrace = normalizeStackTrace(conf.stackTrace);
  const [stackTraceAsync, stackTraceAsyncE] = normalizeStackTraceAsync(
    conf.stackTraceAsync,
    timer
  );
  const stackTraceShift = normalizeStackTraceShift(conf.stackTraceShift);

  // formatting
  const [format, formatE] = normalizeFormat(conf.format);
  const [formatErrors, formatErrorsE] = normalizeFormatErrors(
    conf.formatErrors
  );
  const highlight = normalizeHighlight(conf.highlight);
  const inspectOptions = normalizeInspectOptions(conf.inspectOptions);

  // in-place options
  const id = normalizeId(conf.id, timer, task);
  const [repeat, repeatE] = normalizeRepeat(conf.repeat, timer);

  [timerE, repeatE, stackTraceAsyncE, formatE, formatErrorsE].forEach(x => {
    if (x !== null) warning(conf, x);
  });

  return ({
    ...conf,
    timer,
    clone,

    // stacktrace
    stackTrace,
    stackTraceAsync,
    stackTraceShift,

    // formatting
    format,
    formatErrors,
    highlight,
    inspectOptions,

    // in-place options
    id,
    repeat
  }: any);
}
