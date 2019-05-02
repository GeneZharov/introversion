// @flow

import Chalk from "chalk";

import type { _Conf } from "../../../types/_conf";
import { formatStackFrame } from "../../../util/format/formatStackFrame";
import {
  inspect,
  cloneTry,
  devFmt,
  devRaw,
  getTrace,
  logFmt,
  logRaw
} from "./util";

const chalk = new Chalk.constructor();

export function logVal(
  name: string,
  conf: _Conf,
  depth: number,
  quiet: boolean,
  extras: mixed[],
  val: mixed[]
): void {
  const _clone = cloneTry(conf);

  function logValRaw(trace, frameIdx, frame) {
    logRaw(conf, [
      [
        `${name}()`,
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
        [..._clone(extras), ...(quiet ? [] : _clone(val))]
      ],
      ...(conf.dev ? devRaw(_clone(conf), trace, frameIdx) : [])
    ]);
  }

  function logValFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    logFmt(conf, [
      [
        chalk.bold(`${name}()`),
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : [])
      ],
      [inspect(conf, [...extras, ...(quiet ? [] : val)])],
      ...(conf.dev ? devFmt(conf, trace, frameIdx) : [])
    ]);
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format
      ? logValFmt(trace, frameIdx, frame)
      : logValRaw(trace, frameIdx, frame);
  });
}
