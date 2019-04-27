// @flow

import util from "util";

import { clone, fromPairs } from "ramda";
import Chalk from "chalk";
import Stacktrace from "stacktrace-js";

import type { StackFrame, TimerOption } from "../../types/conf";
import type { _Conf } from "../../types/_conf";
import { _warning } from "../../errors/util";
import { errExtraArgsNotAllowed } from "../../errors/options-runtime";
import { formatStackFrame } from "../format/formatStackFrame";
import { formatSuffix } from "../number/suffix";
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
  conf.log(meta("Dev Config"), conf);
  conf.log(meta("Dev StackTrace"), [
    // Wrapped in an array to force a console to collapse the value
    fromPairs(
      trace.map((frame, idx) => {
        const idxStr = idx === frameIdx ? `${idx} <=` : idx;
        const frameStr = formatStackFrame(conf.stackTrace, frame);
        return [idxStr, frameStr];
      })
    )
  ]);
}

function logDevFmt(conf: _Conf, trace: StackFrame[], frameIdx: number) {
  conf.log(metaFmt("Dev: config"));
  conf.log(inspect(conf, conf));
  conf.log(metaFmt("Dev: stacktrace"));
  trace.forEach((frame, idx) => {
    const idxStr = idx === frameIdx ? `[${idx}]` : ` ${idx} `;
    const frameStr = formatStackFrame(conf.stackTrace, frame);
    conf.log(`${idxStr} — ${frameStr}`);
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
    conf.log(
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
    conf.log(
      chalk.bold(`${name}()`),
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
    );
    conf.log(inspect(conf, [...extras, ...(quiet ? [] : val)]));
    if (conf.dev) {
      logDevFmt(conf, trace, frameIdx);
    }
    conf.log(" "); // New line
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
    conf.log(
      `${name}()`,
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
      ...(extras.length ? [_clone(extras)] : [])
    );
    if (!quiet) {
      conf.log(meta("Params"), _clone(args));
      error
        ? conf.log(meta("ERROR!"), _clone(result))
        : conf.log(meta("Result"), _clone(result));
    }
    if (conf.dev) {
      logDev(_clone(conf), trace, frameIdx);
    }
  }

  function logFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    conf.log(
      chalk.bold(`${name}()`),
      ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
    );
    if (extras.length) {
      conf.log(inspect(conf, extras));
    }
    if (!quiet) {
      conf.log(metaFmt("Params"));
      conf.log(inspect(conf, args));
      conf.log(error ? metaFmt("ERROR!") : metaFmt("Result"));
      conf.log(inspect(conf, result));
    }
    if (conf.dev) {
      logDevFmt(conf, trace, frameIdx);
    }
    conf.log(" "); // New line
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
      conf.log(
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
      conf.log(
        chalk.bold(`${name}()`),
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
      );
      if (args.length) {
        conf.log(inspect(conf, args));
      }
      conf.log(
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
    conf.log(" "); // New line
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format ? logFmt(trace, frameIdx, frame) : log(trace, frameIdx, frame);
    if (conf.timer === "console" && args.length) {
      _warning(conf, errExtraArgsNotAllowed());
    }
  });
}
