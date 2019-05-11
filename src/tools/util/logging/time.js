// @flow

import Chalk from "chalk";

import { REPEAT_OPT_SUFFIXES } from "../../../const";
import type { TimerOption } from "../../../types/conf";
import type { _Conf } from "../../../types/_conf";
import { _warning } from "../../../errors/util";
import {
  cloneTry,
  devFmt,
  devRaw,
  getTrace,
  logFmt,
  logRaw,
  inspect
} from "./util";
import { errExtraArgsNotAllowed } from "../../../errors/options-runtime";
import { formatStackFrame } from "../../../util/format/formatStackFrame";
import { formatSuffix } from "../../../util/number/suffix";
import { round } from "../../../util/number/round";

const chalk = new Chalk.constructor();

function formatTimer(timer: TimerOption): string {
  switch (timer) {
    case "performance":
      return "performance.now()";
    case "date":
      return "Date.now()";
    default:
      return "";
  }
}

export function logTime(
  name: string,
  conf: _Conf,
  depth: number,
  args: mixed[],
  ellapsed: number
): void {
  const _clone = cloneTry(conf);
  const _round = n => round(conf.precision, n);
  const _suffix = n => formatSuffix(REPEAT_OPT_SUFFIXES, n);

  function logTimeRaw(trace, frameIdx, frame) {
    logRaw(conf, [
      ...(conf.timer === "console"
        ? []
        : [
            [
              `${name}()`,
              ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
              ...(args.length ? [_clone(args)] : []),
              `${_round(ellapsed / conf.repeat)} ms`,
              ...(conf.repeat > 1
                ? [
                    `(${_suffix(conf.repeat)} repeats in ${_round(
                      ellapsed
                    )} ms)`
                  ]
                : []),
              ...(typeof conf.timer !== "function"
                ? [`by ${formatTimer(conf.timer)}`]
                : [])
            ]
          ]),
      ...(conf.dev ? devRaw(_clone(conf), trace, frameIdx) : [])
    ]);
  }

  function logTimeFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    logFmt(conf, [
      ...(conf.timer === "console"
        ? []
        : [
            [
              chalk.bold(`${name}()`),
              ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
            ],
            ...(args.length ? [[inspect(conf, args)]] : []),
            [
              `${_round(ellapsed / conf.repeat)} ms`,
              ...(conf.repeat > 1
                ? [
                    `(${_suffix(conf.repeat)} repeats in ${_round(
                      ellapsed
                    )} ms)`
                  ]
                : []),
              ...(typeof conf.timer !== "function"
                ? [`by ${formatTimer(conf.timer)}`]
                : [])
            ]
          ]),
      ...(conf.dev ? devFmt(conf, trace, frameIdx) : [])
    ]);
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format
      ? logTimeFmt(trace, frameIdx, frame)
      : logTimeRaw(trace, frameIdx, frame);
    if (conf.timer === "console" && args.length) {
      _warning(conf, errExtraArgsNotAllowed());
    }
  });
}
