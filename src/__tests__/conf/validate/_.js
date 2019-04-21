// @flow

import {
  invalidCloneOpt,
  invalidDevOpt,
  invalidFormatOpt,
  invalidGuardOpt,
  invalidHighlightOpt,
  invalidInspectOptionsOpt,
  invalidPrecisionOpt,
  invalidPrintOpt,
  invalidRepeatOpt,
  invalidStackTraceAsyncOpt,
  invalidStackTraceOpt,
  invalidStackTraceShiftOpt,
  invalidTimerOpt,
  unknownOpt
} from "../../../errors/conf";
import In from "../../../index";

test("unknown option", () => {
  const opt = "asfd";
  const conf = ({ [opt]: false }: any);
  expect(() => In.setDefaults(conf)).toThrow(unknownOpt(opt));
  expect(() => In.instance(conf)).toThrow(unknownOpt(opt));
  expect(() => In.v.with(conf)).toThrow(unknownOpt(opt));
});

test('invalid "timer" option', () => {
  const conf = ({ timer: false }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidTimerOpt());
  expect(() => In.instance(conf)).toThrow(invalidTimerOpt());
  expect(() => In.v.with(conf)).toThrow(invalidTimerOpt());
});

test('invalid "print" option', () => {
  const conf = ({ print: false }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidPrintOpt());
  expect(() => In.instance(conf)).toThrow(invalidPrintOpt());
  expect(() => In.v.with(conf)).toThrow(invalidPrintOpt());
});

test('invalid "clone" option', () => {
  const conf = ({ clone: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidCloneOpt());
  expect(() => In.instance(conf)).toThrow(invalidCloneOpt());
  expect(() => In.v.with(conf)).toThrow(invalidCloneOpt());
});

test('invalid "precision" option', () => {
  const conf = ({ precision: -1 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidPrecisionOpt());
  expect(() => In.instance(conf)).toThrow(invalidPrecisionOpt());
  expect(() => In.v.with(conf)).toThrow(invalidPrecisionOpt());
});

test('invalid "dev" option', () => {
  const conf = ({ dev: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidDevOpt());
  expect(() => In.instance(conf)).toThrow(invalidDevOpt());
  expect(() => In.v.with(conf)).toThrow(invalidDevOpt());
});

test('invalid "stackTrace" option', () => {
  const conf = ({ stackTrace: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidStackTraceOpt());
  expect(() => In.instance(conf)).toThrow(invalidStackTraceOpt());
  expect(() => In.v.with(conf)).toThrow(invalidStackTraceOpt());
});

test('invalid "stackTraceShift" option', () => {
  const conf = ({ stackTraceShift: false }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidStackTraceShiftOpt());
  expect(() => In.instance(conf)).toThrow(invalidStackTraceShiftOpt());
  expect(() => In.v.with(conf)).toThrow(invalidStackTraceShiftOpt());
});

test('invalid "stackTraceAsync" option', () => {
  const conf = ({ stackTraceAsync: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidStackTraceAsyncOpt());
  expect(() => In.instance(conf)).toThrow(invalidStackTraceAsyncOpt());
  expect(() => In.v.with(conf)).toThrow(invalidStackTraceAsyncOpt());
});

describe('invalid "format" option', () => {
  const conf = ({ format: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidFormatOpt());
  expect(() => In.instance(conf)).toThrow(invalidFormatOpt());
  expect(() => In.v.with(conf)).toThrow(invalidFormatOpt());
});

describe('invalid "highlight" option', () => {
  const conf = ({ highlight: 0 }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidHighlightOpt());
  expect(() => In.instance(conf)).toThrow(invalidHighlightOpt());
  expect(() => In.v.with(conf)).toThrow(invalidHighlightOpt());
});

describe('invalid "inspectOptions" option', () => {
  const conf = ({ inspectOptions: false }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidInspectOptionsOpt());
  expect(() => In.instance(conf)).toThrow(invalidInspectOptionsOpt());
  expect(() => In.v.with(conf)).toThrow(invalidInspectOptionsOpt());
});

describe('invalid "guard" option', () => {
  const conf = ({ guard: null }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidGuardOpt());
  expect(() => In.instance(conf)).toThrow(invalidGuardOpt());
  expect(() => In.v.with(conf)).toThrow(invalidGuardOpt());
});

describe('invalid "repeat" option', () => {
  const conf = ({ repeat: null }: any);
  expect(() => In.setDefaults(conf)).toThrow(invalidRepeatOpt());
  expect(() => In.instance(conf)).toThrow(invalidRepeatOpt());
  expect(() => In.v.with(conf)).toThrow(invalidRepeatOpt());
});
