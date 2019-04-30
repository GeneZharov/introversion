// @flow

import { defaultConf } from "../../../defaultConf";
import {
  errInvalidClone,
  errInvalidDev,
  errInvalidDevTools,
  errInvalidErrorHandling,
  errInvalidFormat,
  errInvalidFormatErrors,
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
import { logV, setDefaults } from "../../..";

const log = jest.fn();
const warn = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    warn,
    devTools: false,
    format: false,
    clone: false
  });
});

afterAll(() => setDefaults(defaultConf));

beforeEach(() => {
  log.mockClear();
  warn.mockClear();
});

test("unknown option", () => {
  const opt = s => `unknown-${s}`;
  const conf2 = ({ [opt(2)]: false }: any);
  const conf3 = ({ [opt(3)]: false }: any);
  logV.with(conf2)();
  logV.with(conf3)();
  const [msg2] = errUnknownOpt(opt(2));
  const [msg3] = errUnknownOpt(opt(3));
  expect(warn.mock.calls[0][0]).toEqual(expect.stringContaining(msg2));
  expect(warn.mock.calls[1][0]).toEqual(expect.stringContaining(msg3));
});

test('invalid "timer" option', () => {
  const conf = ({ timer: false }: any);
  logV.with(conf)();
  const [msg] = errInvalidTimer();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "log" option', () => {
  const conf = ({ log: false }: any);
  logV.with(conf)();
  const [msg] = errInvalidLog();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "warn" option', () => {
  const conf = ({ warn: false }: any);
  const [msg] = errInvalidWarn();
  expect(() => logV.with(conf)()).toThrow(msg);
});

test('invalid "clone" option', () => {
  const conf = ({ clone: 0 }: any);
  logV.with(conf)();
  const [msg] = errInvalidClone();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "errorHandling" option', () => {
  const conf = ({ errorHandling: false }: any);
  const [msg] = errInvalidErrorHandling();
  expect(() => logV.with(conf)()).toThrow(msg);
});

test('invalid "precision" option', () => {
  const conf = ({ precision: -1 }: any);
  logV.with(conf)();
  const [msg] = errInvalidPrecision();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "devTools" option', () => {
  const conf = ({ devTools: 0 }: any);
  const [msg] = errInvalidDevTools();
  expect(() => logV.with(conf)()).toThrow(msg);
});

test('invalid "dev" option', () => {
  const conf = ({ dev: 0 }: any);
  logV.with(conf)();
  const [msg] = errInvalidDev();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTrace" option', () => {
  const conf = ({ stackTrace: 0 }: any);
  logV.with(conf)();
  const [msg] = errInvalidStackTrace();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTraceShift" option', () => {
  const conf = ({ stackTraceShift: false }: any);
  logV.with(conf)();
  const [msg] = errInvalidStackTraceShift();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "stackTraceAsync" option', () => {
  const conf = ({ stackTraceAsync: 0 }: any);
  logV.with(conf)();
  const [msg] = errInvalidStackTraceAsync();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "format" option', () => {
  const conf = ({ format: 0 }: any);
  const [msg] = errInvalidFormat();
  expect(() => logV.with(conf)()).toThrow(msg);
});

test('invalid "formatErrors" option', () => {
  const conf = ({ formatErrors: 0 }: any);
  const [msg] = errInvalidFormatErrors();
  expect(() => logV.with(conf)()).toThrow(msg);
});

test('invalid "highlight" option', () => {
  const conf = ({ highlight: 0 }: any);
  logV.with(conf)();
  const [msg] = errInvalidHighlight();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "inspectOptions" option', () => {
  const conf = ({ inspectOptions: false }: any);
  logV.with(conf)();
  const [msg] = errInvalidInspectOptions();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "guard" option', () => {
  const conf = ({ guard: null }: any);
  logV.with(conf)();
  const [msg] = errInvalidGuard();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});

test('invalid "repeat" option', () => {
  const conf = ({ repeat: null }: any);
  logV.with(conf)();
  const [msg] = errInvalidRepeat();
  expect(warn).toBeCalledWith(expect.stringContaining(msg));
});
