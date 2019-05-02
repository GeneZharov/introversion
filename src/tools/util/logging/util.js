// @flow

import util from "util";

import { clone, fromPairs } from "ramda";
import Chalk from "chalk";
import Stacktrace from "stacktrace-js";

import type { StackFrame } from "../../../types/conf";
import type { _Conf } from "../../../types/_conf";
import { formatStackFrame } from "../../../util/format/formatStackFrame";

const chalk = new Chalk.constructor();

export const cloneTry = (conf: _Conf) => <T>(val: T): T =>
  conf.clone ? clone(val) : val;

export function inspect(conf: _Conf, x: mixed): string {
  return util.inspect(x, conf.inspectOptions);
}

export function getTrace(conf: _Conf, cb: (StackFrame[]) => mixed) {
  if (conf.stackTrace.length) {
    if (conf.stackTraceAsync) {
      Stacktrace.get().then(xs => setTimeout(() => cb(xs), 0));
    } else {
      cb(Stacktrace.getSync());
    }
  } else {
    cb([]);
  }
}

export const metaRaw = (s: string): string => `... ${s}:`;
export const metaFmt = (s: string): string => chalk.italic(`--- ${s} ---`);

export function devRaw(
  conf: _Conf,
  trace: StackFrame[],
  frameIdx: number
): mixed[][] {
  return [
    [metaRaw("Dev Config"), conf],
    [
      metaRaw("Dev StackTrace"),
      [
        // Wrapped in an array to force a console to collapse it
        fromPairs(
          trace.map((frame, idx) => {
            const idxStr = idx === frameIdx ? `${idx} <=` : idx;
            const frameStr = formatStackFrame(conf.stackTrace, frame);
            return [idxStr, frameStr];
          })
        )
      ]
    ]
  ];
}

export function devFmt(
  conf: _Conf,
  trace: StackFrame[],
  frameIdx: number
): string[][] {
  return [
    [metaFmt("Dev: config")],
    [inspect(conf, conf)],
    [metaFmt("Dev: stacktrace")],
    trace.map((frame, idx) => {
      const idxStr = idx === frameIdx ? `[${idx}]` : ` ${idx} `;
      const frameStr = formatStackFrame(conf.stackTrace, frame);
      return `${idxStr} — ${frameStr}`;
    })
  ];
}

export function logRaw(conf: _Conf, calls: mixed[][]): void {
  calls.forEach(args => conf.log(...args));
}

export function logFmt(conf: _Conf, lines: string[][]): void {
  const view = lines.map(words => words.join(" ")).join("\n") + " \n";
  conf.log(view);
}
