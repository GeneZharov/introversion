// @flow

import type {
  AutoBoolean,
  Conf,
  StackTraceItem,
  TimerOption
} from "../../types/conf";
import type { Task } from "../../types/_";
import type { _Conf, _TimerOption } from "../../types/_conf";
import { detectConsole } from "../detect/detectConsole";
import { detectDevTools } from "../detect/detectDevTools";
import { detectPerformance } from "../detect/detectPerformance";
import { detectReactNative } from "../detect/detectReactNative";
import { detectTerminal } from "../detect/detectTerminal";
import { genString } from "../string/genString";
import { invalidRepeatOpt } from "../../errors/conf";
import { parseSuffix } from "../number/suffix";
import {
  repeatNotAllowed,
  stackTraceAsyncNotAllowed
} from "../../errors/conf-runtime";

function normalizeTimer(timer: TimerOption): _TimerOption {
  return timer !== "auto"
    ? timer
    : detectPerformance()
    ? "performance"
    : detectConsole()
    ? "console"
    : "date";
}

function normalizeClone(clone: AutoBoolean): boolean {
  return clone === "auto" ? !detectTerminal() || detectDevTools() : clone;
}

function normalizeId(timer: _TimerOption, task: Task, id: mixed): mixed {
  return typeof id !== "undefined"
    ? timer === "console"
      ? genString(id)
      : id
    : task;
}

function normalizeRepeat(timer: _TimerOption, repeat: number | string): number {
  const _repeat = typeof repeat === "string" ? parseSuffix(repeat) : repeat;
  if (isNaN(_repeat) || _repeat === 0) {
    throw invalidRepeatOpt();
  }
  if (timer === "console" && _repeat > 1) {
    throw new repeatNotAllowed();
  }
  return _repeat;
}

function normalizeStackTrace(
  stackTrace: boolean | StackTraceItem[]
): StackTraceItem[] {
  return typeof stackTrace === "boolean"
    ? stackTrace
      ? ["func", "file", "line", "col"]
      : []
    : stackTrace;
}

function normalizeStackTraceAsync(
  timer: _TimerOption,
  stackTraceAsync: AutoBoolean
): boolean {
  if (timer === "console" && stackTraceAsync === true) {
    throw stackTraceAsyncNotAllowed();
  } else if (stackTraceAsync === "auto") {
    return timer !== "console" && !detectReactNative();
  } else {
    return stackTraceAsync;
  }
}

function normalizeFormat(format: AutoBoolean): boolean {
  return format === "auto" ? detectTerminal() && !detectDevTools() : format;
}

export function normalizeConf(conf: Conf, task: Task): _Conf {
  const timer = normalizeTimer(conf.timer);
  const clone = normalizeClone(conf.clone);
  const id = normalizeId(timer, task, conf.id);
  const repeat = normalizeRepeat(timer, conf.repeat);
  const stackTrace = normalizeStackTrace(conf.stackTrace);
  const stackTraceAsync = normalizeStackTraceAsync(timer, conf.stackTraceAsync);
  const format = normalizeFormat(conf.format);
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
