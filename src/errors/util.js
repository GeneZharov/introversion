// @flow

import Stacktrace from "stacktrace-js";
import chalk from "chalk";

import type { Auto, Print } from "../types/conf";
import {
  errInvalidDevTools,
  errInvalidFormatErrors,
  errInvalidWarn
} from "./options";
import { formatStackFrame } from "../util/format/formatStackFrame";
import {
  normalizeDevTools,
  normalizeFormatErrors
} from "../tools/util/normalize/options";
import {
  validDevTools,
  validFormatErrors,
  validWarn
} from "../tools/util/validate/options";

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
    warn,
    errorHandling,
    formatErrors
  }: {
    warn: Print,
    errorHandling: "warn" | "throw",
    formatErrors: boolean
  },
  msg: string[]
): void {
  if (errorHandling === "throw") error(msg);
  const trace = Stacktrace.getSync()
    .map(f => formatStackFrame(["file", "func", "line", "col"], f))
    .slice(1);
  formatErrors ? warn(formatWarnFmt(msg, trace)) : warn(formatWarn(msg));
}

export function warning(
  {
    warn,
    errorHandling,
    devTools,
    formatErrors
  }: {
    warn: Print,
    errorHandling: "warn" | "throw",
    devTools: Auto<boolean>,
    formatErrors: Auto<boolean>
  },
  msg: string[]
): void {
  if (errorHandling === "throw") error(msg);
  if (!validWarn(warn)) error(errInvalidWarn());
  if (!validFormatErrors(formatErrors)) error(errInvalidFormatErrors());
  if (!validDevTools(devTools)) error(errInvalidDevTools());
  const trace = Stacktrace.getSync()
    .map(f => formatStackFrame(["file", "func", "line", "col"], f))
    .slice(1);
  const getDevTools = () => normalizeDevTools(devTools);
  const [_formatErrors] = normalizeFormatErrors(formatErrors, getDevTools);
  _formatErrors ? warn(formatWarnFmt(msg, trace)) : warn(formatWarn(msg));
}

export function error(msg: string[]): void {
  throw new Error(formatError(msg));
}
