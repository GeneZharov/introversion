// @flow

import { toString } from "ramda";

import type {
  CloneOption,
  Conf,
  FormatOption,
  StackTraceItem,
  TimerOption
} from "../../types/conf";
import type { Task } from "../../types/_";
import type { _Conf, _TimerOption } from "../../types/_conf";
import { detectConsole } from "../detect/detectConsole";
import { detectDevTools } from "../detect/detectDevTools";
import { detectPerformance } from "../detect/detectPerformance";
import { detectTerminal } from "../detect/detectTerminal";
import { invalidRepeatOpt } from "../../errors/conf";
import { parseSuffix } from "../number/suffix";
import { repeatNotAllowed } from "../../errors/conf-compatibility";

function normalizeTimer(timer: TimerOption): _TimerOption {
  return timer !== "auto"
    ? timer
    : detectPerformance()
    ? "performance"
    : detectConsole()
    ? "console"
    : "date";
}

function normalizeClone(clone: CloneOption): boolean {
  return clone === "auto" ? !detectTerminal() || detectDevTools() : clone;
}

function normalizeId(timer: _TimerOption, task: Task, id: mixed): mixed {
  return typeof id !== "undefined"
    ? timer === "console"
      ? typeof id !== "string"
        ? toString(id)
        : id
      : id
    : task;
}

function normalizeRepeat(timer: _TimerOption, repeat: number | string): number {
  const _repeat = typeof repeat === "string" ? parseSuffix(repeat) : repeat;
  // Check for runtime errors
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

function normalizeFormat(format: FormatOption): boolean {
  return format === "auto" ? detectTerminal() && !detectDevTools() : format;
}

export function normalizeConf(conf: Conf, task: Task): _Conf {
  const timer = normalizeTimer(conf.timer);
  const clone = normalizeClone(conf.clone);
  const id = normalizeId(timer, task, conf.id);
  const repeat = normalizeRepeat(timer, conf.repeat);
  const stackTrace = normalizeStackTrace(conf.stackTrace);
  const format = normalizeFormat(conf.format);
  return ({ ...conf, timer, clone, stackTrace, format, id, repeat }: any);
}
