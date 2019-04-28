// @flow

import { contains, isNil, isEmpty } from "ramda";

import type { StackFrame, StackTraceItem } from "../../types/conf";
import { formatFileName } from "./formatFileName";

export function formatStackFrame(
  items: StackTraceItem[],
  stackFrame: StackFrame
): string {
  const showFunc = contains("func", items);
  const showFile = contains("file", items);
  const showLine = contains("line", items);
  const showCol = contains("col", items);

  const {
    functionName: func,
    fileName: file,
    lineNumber: line,
    columnNumber: col
  } = stackFrame;

  function fmtFile(file: any, line: any, col: any): string[] {
    const data = !isNil(file)
      ? [
          ...(!showFile ? [] : [formatFileName(file)]),
          ...(!showLine || isNil(line) ? [] : [":" + line]),
          ...(!showCol || isNil(line) || isNil(col) ? [] : [":" + col])
        ]
      : [];
    return data.length
      ? showFunc
        ? [`(${data.join("")})`]
        : [`${data.join("")}`]
      : [];
  }

  const _func = showFunc && !isNil(func) ? [func] : [];
  const _file = showFile || showLine || showCol ? fmtFile(file, line, col) : [];

  return [
    "at",
    ..._func,
    ..._file,
    ...(isEmpty(_func) && isEmpty(_file) ? ["<unknown>"] : [])
  ].join(" ");
}
