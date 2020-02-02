// @flow

import { type StackFrame } from "../../types/conf";

import { formatStackFrame } from "./formatStackFrame";

function frame(frame: {
  func?: string,
  file?: string,
  line?: number,
  col?: number,
  ...
}): StackFrame {
  const { func, file, line, col } = frame;
  return {
    functionName: func,
    fileName: file,
    lineNumber: line,
    columnNumber: col,
  };
}

const items = ["func", "file", "line", "col"];

const func = "func";
const file = "file.js";
const line = 1;
const col = 2;

const full = frame({ func, file, line, col });

describe("formatStackFrame()", () => {
  test("empty frame", () => {
    expect(formatStackFrame(items, frame({}))).toBe("at <unknown>");
  });
  test("func", () => {
    expect(formatStackFrame(items, frame({ func }))).toBe("at func");
  });
  test("file", () => {
    expect(formatStackFrame(items, frame({ file }))).toBe("at (file.js)");
    expect(formatStackFrame(items, frame({ file, col }))).toBe("at (file.js)");
  });
  test("file, line", () => {
    expect(formatStackFrame(items, frame({ file, line }))).toBe(
      "at (file.js:1)"
    );
  });
  test("file, line, col", () => {
    expect(formatStackFrame(items, frame({ file, line, col }))).toBe(
      "at (file.js:1:2)"
    );
  });
  test("func, file, line, col", () => {
    expect(formatStackFrame(items, frame({ func, file, line, col }))).toBe(
      "at func (file.js:1:2)"
    );
  });
});

test("show single item", () => {
  expect(formatStackFrame(["func"], full)).toBe("at func");
  expect(formatStackFrame(["file"], full)).toBe("at file.js");
  expect(formatStackFrame(["line"], full)).toBe("at :1");
  expect(formatStackFrame(["col"], full)).toBe("at :2");
});
test("show two items", () => {
  expect(formatStackFrame(["func", "file"], full)).toBe("at func (file.js)");
  expect(formatStackFrame(["func", "line"], full)).toBe("at func (:1)");
  expect(formatStackFrame(["func", "col"], full)).toBe("at func (:2)");
  expect(formatStackFrame(["file", "line"], full)).toBe("at file.js:1");
  expect(formatStackFrame(["file", "col"], full)).toBe("at file.js:2");
  expect(formatStackFrame(["line", "col"], full)).toBe("at :1:2");
});
test("show tree items", () => {
  expect(formatStackFrame(["func", "file", "line"], full)).toBe(
    "at func (file.js:1)"
  );
  expect(formatStackFrame(["func", "file", "col"], full)).toBe(
    "at func (file.js:2)"
  );
  expect(formatStackFrame(["file", "line", "col"], full)).toBe(
    "at file.js:1:2"
  );
  expect(formatStackFrame(["func", "line", "col"], full)).toBe(
    "at func (:1:2)"
  );
});
