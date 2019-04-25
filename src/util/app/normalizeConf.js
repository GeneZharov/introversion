// @flow

import type { Conf } from "../../types/conf";
import type { Task } from "../../types/_";
import type { _Conf } from "../../types/_conf";
import {
  normalizeClone,
  normalizeFormat,
  normalizeId,
  normalizeRepeat,
  normalizeStackTrace,
  normalizeStackTraceAsync,
  normalizeTimer
} from "./normalizeOptions";
import { once } from "../func/once";
import { warning } from "../../errors/util";

const warnOnce = once((conf, msg) => warning(conf, msg));

export function normalizeConf(conf: Conf, task?: Task): _Conf {
  const [timer, timerE] = normalizeTimer(conf.timer);
  const clone = normalizeClone(conf.clone);
  const id = normalizeId(conf.id, timer, task);
  const [repeat, repeatE] = normalizeRepeat(conf.repeat, timer);
  const stackTrace = normalizeStackTrace(conf.stackTrace);
  const [format, formatE] = normalizeFormat(conf.format);
  const [stackTraceAsync, stackTraceAsyncE] = normalizeStackTraceAsync(
    conf.stackTraceAsync,
    timer
  );

  [timerE, repeatE, stackTraceAsyncE].forEach(x => {
    if (x !== null) warning(conf, x);
  });

  if (formatE !== null) {
    warnOnce(conf, formatE);
  }

  return ({
    ...conf,
    timer,
    clone,
    stackTrace,
    stackTraceAsync,
    format,
    id,
    repeat
  }: any);
}
