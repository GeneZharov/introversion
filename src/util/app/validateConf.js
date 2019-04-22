// @flow

import { toPairs, type } from "ramda";

import type { Conf } from "../../types/conf";
import {
  invalidCloneOpt,
  invalidConfType,
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
} from "../../errors/conf";

const validators = {
  timer(val) {
    if (
      val !== "auto" &&
      val !== "performance" &&
      val !== "console" &&
      val !== "date" &&
      typeof val !== "function"
    ) {
      throw invalidTimerOpt();
    }
  },

  print(val) {
    if (typeof val !== "function") {
      throw invalidPrintOpt();
    }
  },

  clone(val) {
    if (val !== "auto" && typeof val !== "boolean") {
      throw invalidCloneOpt();
    }
  },

  precision(val) {
    if (typeof val !== "number" || isNaN(val) || val <= 0) {
      throw invalidPrecisionOpt();
    }
  },

  dev(val) {
    if (typeof val !== "boolean") {
      throw invalidDevOpt();
    }
  },

  stackTrace(val) {
    if (typeof val !== "boolean" && !Array.isArray(val)) {
      throw invalidStackTraceOpt();
    }
  },

  stackTraceAsync(val) {
    if (typeof val !== "boolean") {
      throw invalidStackTraceAsyncOpt();
    }
  },

  stackTraceShift(val) {
    if (typeof val !== "number") {
      throw invalidStackTraceShiftOpt();
    }
  },

  format(val) {
    if (val !== "auto" && typeof val !== "boolean") {
      throw invalidFormatOpt();
    }
  },

  highlight(val) {
    if (typeof val !== "boolean") {
      throw invalidHighlightOpt();
    }
  },

  inspectOptions(val) {
    if (typeof val !== "object" || val === null) {
      throw invalidInspectOptionsOpt();
    }
  },

  id(val) {
    return;
  },

  guard(val) {
    if (typeof val !== "number") {
      throw invalidGuardOpt();
    }
  },

  repeat(val) {
    if (typeof val !== "number" && typeof val !== "string") {
      throw invalidRepeatOpt();
    }
  }
};

export function validateConf(conf: mixed): void {
  if (type(conf) !== "Object") {
    throw invalidConfType();
  }
  (toPairs: any)(conf).forEach(([name, val]) => {
    const validator = validators[name];
    if (!validator) {
      throw unknownOpt(name);
    } else {
      validator(val);
    }
  });
}
