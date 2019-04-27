// @flow

import Stacktrace from "stacktrace-js";
import chalk from "chalk";

import type { AutoBoolean, ErrorHandlingOption, Print } from "../types/conf";
import { errInvalidFormat, errInvalidWarn } from "./options";
import { formatStackFrame } from "../util/format/formatStackFrame";
import { normalizeFormat } from "../util/app/normalizeOptions";
import { validFormat, validWarn } from "../util/app/validateOptions";

const stripe = str => {
  const bar = chalk.yellow("▒");
  return str === "" ? bar : bar + "  " + str;
};

export function formatError(msg: string[]): string {
  return ["Introversion Error", "", ...msg].join("\n") + "\n";
}

export function formatWarn(msg: string[]): string {
  return ["Introversion Warning", "", ...msg].join("\n") + "\n";
}

export function formatWarnFmt(msg: string[], trace: string[]): string {
  return (
    [chalk.bold("Introversion"), "", ...msg, "", ...trace]
      .map(stripe)
      .join("\n") + "\n"
  );
}

export function _warning(
  {
    errorHandling,
    warn,
    format
  }: {
    errorHandling: ErrorHandlingOption,
    warn: Print,
    format: boolean
  },
  msg: string[]
): void {
  if (errorHandling === "throw") error(msg);
  const trace = Stacktrace.getSync()
    .map(f => formatStackFrame(["file", "func", "line", "col"], f))
    .slice(1);
  format ? warn(formatWarnFmt(msg, trace)) : warn(formatWarn(msg));
}

export function warning(
  {
    errorHandling,
    warn,
    format
  }: {
    errorHandling: ErrorHandlingOption,
    warn: Print,
    format: AutoBoolean
  },
  msg: string[]
): void {
  if (errorHandling === "throw") error(msg);
  if (!validWarn(warn)) error(errInvalidWarn());
  if (!validFormat(format)) error(errInvalidFormat());
  const trace = Stacktrace.getSync()
    .map(f => formatStackFrame(["file", "func", "line", "col"], f))
    .slice(1);
  const [_format] = normalizeFormat(format);
  _format ? warn(formatWarnFmt(msg, trace)) : warn(formatWarn(msg));
}

export function error(msg: string[]): void {
  throw new Error(formatError(msg));
}
