// @flow

import {
  invalidColorOpt,
  invalidDepthOpt,
  invalidFormatOpt,
  invalidGuardOpt,
  invalidIdOpt,
  invalidPrintOpt,
  invalidRepeatOpt,
  invalidShowHiddenOpt,
  invalidTimerOpt,
  unknownOpt
} from "../errors/conf";
import I from "../index";

describe("unknown option", () => {
  const opt = "asfd";
  const conf = ({ [opt]: false }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(unknownOpt(opt));
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(unknownOpt(opt));
  });
});

describe('invalid "print" option', () => {
  const conf = ({ print: false }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidPrintOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidPrintOpt());
  });
});

describe('invalid "timer" option', () => {
  const conf = ({ timer: false }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidTimerOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidTimerOpt());
  });
});

describe('invalid "format" option', () => {
  const conf = ({ format: 4 }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidFormatOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidFormatOpt());
  });
});

describe('invalid "showHidden" option', () => {
  const conf = ({ showHidden: 4 }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidShowHiddenOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidShowHiddenOpt());
  });
});

describe('invalid "depth" option', () => {
  const conf = ({ depth: false }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidDepthOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidDepthOpt());
  });
});

describe('invalid "color" option', () => {
  const conf = ({ color: 55 }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidColorOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidColorOpt());
  });
});

describe('invalid "id" option', () => {
  const conf = ({ id: 55 }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidIdOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidIdOpt());
  });
});

describe('invalid "guard" option', () => {
  const conf = ({ guard: null }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidGuardOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidGuardOpt());
  });
});

describe('invalid "repeat" option', () => {
  const conf = ({ repeat: null }: any);
  test("global config", () => {
    expect(() => I.config(conf)).toThrow(invalidRepeatOpt());
  });
  test("in-place config", () => {
    expect(() => I.v.with(conf)).toThrow(invalidRepeatOpt());
  });
});
