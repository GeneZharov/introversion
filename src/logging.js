// @flow

import type { Conf } from "./types";

function printLines(conf: Conf, xs: mixed[]) {
  xs.forEach(x => conf.print(x));
}

function fmt(conf: Conf, x: mixed): string {
  const _require = require;
  const util = _require("util");
  // Otherwise react-native gives a warning
  return util.inspect(
    x,
    conf.showHidden,
    conf.depth === Infinity ? null : conf.depth,
    conf.color
  );
}

export function logVal(
  conf: Conf,
  quiet: boolean,
  extras: mixed[],
  val: mixed
): void {
  function logFormatted() {
    if (!quiet) extras.push(val);
    conf.print("# V");
    conf.print(fmt(conf, extras));
    conf.print(); // New line for terminals
  }

  function logTerse() {
    if (!quiet) extras.push(val);
    conf.print("V:", extras);
  }

  conf.format ? logFormatted() : logTerse();
}

export function logFn(
  conf: Conf,
  error: boolean,
  quiet: boolean,
  extras: mixed[],
  args: mixed[],
  result: mixed
): void {
  function logFormatted() {
    printLines(conf, ["# F", fmt(conf, extras)]);
    if (!quiet) {
      const line = "----------";
      const resLabel = error ? "# F ERROR!" : "# F Result";
      printLines(conf, [line, "# F Params", fmt(conf, args)]);
      printLines(conf, [line, resLabel, fmt(conf, result)]);
    }
    conf.print(); // New line for terminals
  }

  function logTerse() {
    conf.print("F:", extras);
    if (!quiet) {
      conf.print("F Params:", args);
      error ? conf.print("F ERROR!:", result) : conf.print("F Result:", result);
    }
  }

  conf.format ? logFormatted() : logTerse();
}
