// @flow

import util from "util";

import { T, clone, fromPairs } from "ramda";
import Chalk from "chalk";
import Stacktrace from "stacktrace-js";

import type { StackFrame, TimerOption } from "../../types/conf";
import type { _Conf } from "../../types/_conf";
import { extraArgsNotAllowed } from "../../errors/conf-runtime";
import { formatStackFrame } from "../format/formatStackFrame";
import { formatSuffix } from "../number/suffix";
import { stringView } from "../string/stringView";
import { round } from "../number/round";

const chalk = new Chalk.constructor();

const cloneTry = (conf: _Conf) => <T>(val: T): T =>
  conf.clone ? clone(val) : val;

function inspect(conf: _Conf, x: mixed): string {
  return util.inspect(x, conf.inspectOptions);
}

function getTrace(conf: _Conf, cb: (StackFrame[]) => mixed) {
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

const meta = s => `... ${s}:`;
const metaFmt = s => chalk.italic(`--- ${s} ---`);

function logDev(conf: _Conf, trace: StackFrame[], frameIdx: number) {
  conf.print(meta("Dev Config"), conf);
  conf.print(meta("Dev StackTrace"), [
    // Wrapped in an array to force a console to collapse the value
    fromPairs(
      trace.map((frame, idx) => {
        const idxStr = idx === frameIdx ? `[${idx}]` : ` ${idx} `;
        const frameStr = formatStackFrame(conf.stackTrace, frame);
        return [idxStr, frameStr];
      })
    )
  ]);
}

function logDevFmt(conf: _Conf, trace: StackFrame[], frameIdx: number) {
  conf.print(metaFmt("Dev: config"));
  conf.print(inspect(conf, conf));
  conf.print(metaFmt("Dev: stacktrace"));
  trace.forEach((frame, idx) => {
    const idxStr = idx === frameIdx ? `[${idx}]` : ` ${idx} `;
    const frameStr = formatStackFrame(conf.stackTrace, frame);
    conf.print(`${idxStr} — ${frameStr}`);
  });
}

export function logVal(
  name: string,
  conf: _Conf,
  depth: number,
  quiet: boolean,
  extras: mixed[],
  val: mixed[]
): void {
  const _clone = cloneTry(conf);

  function log(trace, frameIdx, frame) {
    conf.print(
      `${name}()`,
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
      [..._clone(extras), ...(quiet ? [] : _clone(val))]
    );
    if (conf.dev) {
      logDev(_clone(conf), trace, frameIdx);
    }
  }

  function logFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    conf.print(
      chalk.bold(`${name}()`),
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
    );
    conf.print(inspect(conf, [...extras, ...(quiet ? [] : val)]));
    if (conf.dev) {
      logDevFmt(conf, trace, frameIdx);
    }
    conf.print(""); // New line
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format ? logFmt(trace, frameIdx, frame) : log(trace, frameIdx, frame);
  });
}

export function logFn(
  name: string,
  conf: _Conf,
  depth: number,
  error: boolean,
  quiet: boolean,
  extras: mixed[],
  args: mixed[],
  result: mixed
): void {
  const _clone = cloneTry(conf);

  function log(trace, frameIdx, frame) {
    conf.print(
      `${name}()`,
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
      ...(extras.length ? [_clone(extras)] : [])
    );
    if (!quiet) {
      conf.print(meta("Params"), _clone(args));
      error
        ? conf.print(meta("ERROR!"), _clone(result))
        : conf.print(meta("Result"), _clone(result));
    }
    if (conf.dev) {
      logDev(_clone(conf), trace, frameIdx);
    }
  }

  function logFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    conf.print(
      chalk.bold(`${name}()`),
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
    );
    if (extras.length) {
      conf.print(inspect(conf, extras));
    }
    if (!quiet) {
      conf.print(metaFmt("Params"));
      conf.print(inspect(conf, args));
      conf.print(error ? metaFmt("ERROR!") : metaFmt("Result"));
      conf.print(inspect(conf, result));
    }
    if (conf.dev) {
      logDevFmt(conf, trace, frameIdx);
    }
    conf.print(""); // New line
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format ? logFmt(trace, frameIdx, frame) : log(trace, frameIdx, frame);
  });
}

export function logTime(
  name: string,
  conf: _Conf,
  depth: number,
  args: mixed[],
  ellapsed: number
): void {
  if (conf.timer === "console" && args.length) {
    throw extraArgsNotAllowed();
  }

  const _clone = cloneTry(conf);
  const _round = n => round(conf.precision, n);

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

  function log(trace, frameIdx, frame) {
    if (conf.timer !== "console") {
      conf.print(
        `${name}()`,
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
        ...(args.length ? [_clone(args)] : []),
        `${_round(ellapsed / conf.repeat)} ms`,
        ...(conf.repeat > 1
          ? [`(${formatSuffix(conf.repeat)} repeats in ${_round(ellapsed)} ms)`]
          : []),
        ...(typeof conf.timer !== "function"
          ? [`by ${formatTimer(conf.timer)}`]
          : [])
      );
    }
    if (conf.dev) {
      logDev(_clone(conf), trace, frameIdx);
    }
  }

  function logFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    if (conf.timer !== "console") {
      conf.print(
        chalk.bold(`${name}()`),
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
      );
      if (args.length) {
        conf.print(inspect(conf, args));
      }
      conf.print(
        `${_round(ellapsed / conf.repeat)} ms`,
        ...(conf.repeat > 1
          ? [`(${formatSuffix(conf.repeat)} repeats in ${_round(ellapsed)} ms)`]
          : []),
        ...(typeof conf.timer !== "function"
          ? [`by ${formatTimer(conf.timer)}`]
          : [])
      );
    }
    if (conf.dev) {
      logDevFmt(conf, trace, frameIdx);
    }
    conf.print(""); // New line
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format ? logFmt(trace, frameIdx, frame) : log(trace, frameIdx, frame);
  });
}
