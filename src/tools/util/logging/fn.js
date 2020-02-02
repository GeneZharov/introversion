// @flow

import Chalk from "chalk";

import { type _Conf } from "../../../types/_conf";
import { formatStackFrame } from "../../../util/format/formatStackFrame";

import {
  cloneTry,
  devFmt,
  devRaw,
  getTrace,
  inspect,
  logFmt,
  logRaw,
  metaFmt,
  metaRaw,
} from "./util";

const chalk = new Chalk.Instance();

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

  function logFnRaw(trace, frameIdx, frame) {
    logRaw(conf, [
      [
        `${name}()`,
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
        ...(extras.length ? [_clone(extras)] : []),
      ],
      ...(quiet
        ? []
        : [
            [metaRaw("Params"), _clone(args)],
            error
              ? [metaRaw("ERROR!"), _clone(result)]
              : [metaRaw("Result"), _clone(result)],
          ]),
      ...(conf.dev ? devRaw(_clone(conf), trace, frameIdx) : []),
    ]);
  }

  function logFnFmt(trace, frameIdx, frame) {
    chalk.enabled = conf.highlight;
    logFmt(conf, [
      [
        chalk.bold(`${name}()`),
        ...(frame ? [formatStackFrame(conf.stackTrace, frame)] : []),
      ],
      ...(extras.length ? [[inspect(conf, extras)]] : []),
      ...(quiet
        ? []
        : [
            [metaFmt("Params")],
            [inspect(conf, args)],
            [error ? metaFmt("ERROR!") : metaFmt("Result")],
            [inspect(conf, result)],
          ]),
      ...(conf.dev ? devFmt(conf, trace, frameIdx) : []),
    ]);
  }

  getTrace(conf, trace => {
    const frameIdx = depth + conf.stackTraceShift;
    const frame = trace[frameIdx];
    conf.format
      ? logFnFmt(trace, frameIdx, frame)
      : logFnRaw(trace, frameIdx, frame);
  });
}
