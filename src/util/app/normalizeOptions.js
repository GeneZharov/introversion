// @flow

import { isEmpty } from "ramda";
import chalk from "chalk";

import type {
  AutoBoolean,
  StackTraceItem,
  TimerOption
} from "../../types/conf";
import type { Task } from "../../types/_";
import type { _TimerOption } from "../../types/_conf";
import { defaultConf } from "../../conf";
import { detectConsoleTime } from "../detect/detectConsole";
import { detectCorsAvail } from "../detect/detectCorsAvail";
import { detectDevTools } from "../detect/detectDevTools";
import { detectPerformance } from "../detect/detectPerformance";
import { detectReactNative } from "../detect/detectReactNative";
import { detectTerminal } from "../detect/detectTerminal";
import {
  errConsoleNotAvail,
  errFormatErrorsNotAvail,
  errFormatNotAvail,
  errPerformanceNotAvail,
  errRepeatNotAllowed,
  errStackTraceAsyncNotAllowed
} from "../../errors/options-runtime";
import { errInvalidRepeat } from "../../errors/options";
import { parseSuffix } from "../number/suffix";
import { stringView } from "../string/stringView";

type WithErr<T> = [T, null | string[]];

export function normalizeTimer(timer: TimerOption): WithErr<_TimerOption> {
  function getAuto() {
    return detectPerformance()
      ? "performance"
      : detectConsoleTime()
      ? "console"
      : "date";
  }
  if (timer === "performance" && !detectPerformance()) {
    return [getAuto(), errPerformanceNotAvail()];
  }
  if (timer === "console" && !detectConsoleTime()) {
    return [getAuto(), errConsoleNotAvail()];
  }
  return [timer !== "auto" ? timer : getAuto(), null];
}

export function normalizeClone(clone: AutoBoolean): boolean {
  return clone === "auto" ? !detectTerminal() || detectDevTools() : clone;
}

export function normalizeId(
  id: mixed,
  timer: _TimerOption,
  task?: Task
): mixed {
  return typeof id !== "undefined"
    ? timer === "console"
      ? stringView(id)
      : id
    : task;
}

export function normalizeRepeat(
  repeat: number | string,
  timer: _TimerOption
): WithErr<number> {
  function toNumber(x: number | string): number {
    return typeof x === "string" ? parseSuffix(x) : x;
  }
  const _repeat = toNumber(repeat);
  if (isNaN(_repeat) || _repeat === 0) {
    return [toNumber(defaultConf.repeat), errInvalidRepeat()];
  }
  if (timer === "console" && _repeat > 1) {
    return [toNumber(defaultConf.repeat), errRepeatNotAllowed()];
  }
  return [_repeat, null];
}

export function normalizeStackTrace(
  stackTrace: boolean | StackTraceItem[]
): StackTraceItem[] {
  return typeof stackTrace === "boolean"
    ? stackTrace
      ? ["func", "file", "line", "col"]
      : []
    : stackTrace;
}

export function normalizeStackTraceAsync(
  stackTraceAsync: AutoBoolean,
  timer: _TimerOption
): WithErr<boolean> {
  if (timer === "console" && stackTraceAsync === true) {
    return [false, errStackTraceAsyncNotAllowed()];
  } else if (stackTraceAsync === "auto") {
    const b = timer !== "console" && !detectReactNative() && detectCorsAvail();
    return [b, null];
  } else {
    return [stackTraceAsync, null];
  }
}

export function normalizeFormat(format: AutoBoolean): WithErr<boolean> {
  if (format === true && isEmpty(chalk)) {
    return [false, errFormatNotAvail()];
  } else {
    const b =
      format === "auto" ? detectTerminal() && !detectDevTools() : format;
    return [b, null];
  }
}

export function normalizeFormatErrors(
  formatErrors: AutoBoolean
): WithErr<boolean> {
  if (formatErrors === true && isEmpty(chalk)) {
    return [false, errFormatErrorsNotAvail()];
  } else {
    const b =
      formatErrors === "auto"
        ? detectTerminal() && !detectDevTools()
        : formatErrors;
    return [b, null];
  }
}
