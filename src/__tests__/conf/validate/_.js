// @flow

import {
  errInvalidClone,
  errInvalidDev,
  errInvalidFormat,
  errInvalidGuard,
  errInvalidHighlight,
  errInvalidInspectOptions,
  errInvalidLog,
  errInvalidPrecision,
  errInvalidRepeat,
  errInvalidStackTrace,
  errInvalidStackTraceAsync,
  errInvalidStackTraceShift,
  errInvalidTimer,
  errInvalidWarn,
  errUnknownOpt
} from "../../../errors/options";
import Introversion from "../../../index";

const log = jest.fn();
const warn = jest.fn();

const In = Introversion.instance({
  log,
  warn,
  format: false,
  clone: false
});

afterEach(() => {
  log.mockClear();
  warn.mockClear();
});

describe("unknown option", () => {
  const opt = s => `unknown-${s}`;
  test("should be warned once", () => {
    const conf = ({ [opt(0)]: false }: any);
    In.v.with(conf)();
    const [msg] = errUnknownOpt(opt(0));
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should be warned only once", () => {
    const conf = ({ [opt(1)]: false }: any);
    In.v.with(conf)();
    In.v.with(conf)();
    In.v.with(conf)();
    const [msg] = errUnknownOpt(opt(1));
    expect(warn).toBeCalledWith(expect.stringContaining(msg));
  });
  test("should warn once for every unknown option", () => {
    const conf2 = ({ [opt(2)]: false }: any);
    const conf3 = ({ [opt(3)]: false }: any);
    In.v.with(conf2)();
    In.v.with(conf3)();
    const [msg2] = errUnknownOpt(opt(2));
    const [msg3] = errUnknownOpt(opt(3));
    expect(warn.mock.calls[0][0]).toEqual(expect.stringContaining(msg2));
    expect(warn.mock.calls[1][0]).toEqual(expect.stringContaining(msg3));
  });
});

test('invalid "timer" option', () => {
  const conf = ({ timer: false }: any);
  In.v.with(conf)();
  const [msg] = errInvalidTimer();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "log" option', () => {
  const conf = ({ log: false }: any);
  In.v.with(conf)();
  const [msg] = errInvalidLog();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "warn" option', () => {
  const conf = ({ warn: false }: any);
  const [msg] = errInvalidWarn();
  expect(() => In.v.with(conf)()).toThrow(msg);
});

test('invalid "clone" option', () => {
  const conf = ({ clone: 0 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidClone();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "precision" option', () => {
  const conf = ({ precision: -1 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidPrecision();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "dev" option', () => {
  const conf = ({ dev: 0 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidDev();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTrace" option', () => {
  const conf = ({ stackTrace: 0 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidStackTrace();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTraceShift" option', () => {
  const conf = ({ stackTraceShift: false }: any);
  In.v.with(conf)();
  const [msg] = errInvalidStackTraceShift();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTraceAsync" option', () => {
  const conf = ({ stackTraceAsync: 0 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidStackTraceAsync();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

describe('invalid "format" option', () => {
  const conf = ({ format: 0 }: any);
  const [msg] = errInvalidFormat();
  expect(() => In.v.with(conf)()).toThrow(msg);
});

describe('invalid "highlight" option', () => {
  const conf = ({ highlight: 0 }: any);
  In.v.with(conf)();
  const [msg] = errInvalidHighlight();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

describe('invalid "inspectOptions" option', () => {
  const conf = ({ inspectOptions: false }: any);
  In.v.with(conf)();
  const [msg] = errInvalidInspectOptions();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

describe('invalid "guard" option', () => {
  const conf = ({ guard: null }: any);
  In.v.with(conf)();
  const [msg] = errInvalidGuard();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

describe('invalid "repeat" option', () => {
  const conf = ({ repeat: null }: any);
  In.v.with(conf)();
  const [msg] = errInvalidRepeat();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});
