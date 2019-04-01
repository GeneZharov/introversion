// @flow

import entries from "lodash/fp/entries";

import type { Conf } from "../types";
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

const validators = {
  print(val) {
    if (typeof val !== "function") {
      throw invalidPrintOpt();
    }
  },
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
  format(val) {
    if (typeof val !== "boolean") {
      throw invalidFormatOpt();
    }
  },
  showHidden(val) {
    if (typeof val !== "boolean") {
      throw invalidShowHiddenOpt();
    }
  },
  depth(val) {
    if (typeof val !== "number") {
      throw invalidDepthOpt();
    }
  },
  color(val) {
    if (typeof val !== "boolean") {
      throw invalidColorOpt();
    }
  },
  id(val) {
    if (typeof val !== "string") {
      throw invalidIdOpt();
    }
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

export function validateConf(conf: $Shape<Conf>): void {
  entries(conf).forEach(([name, val]) => {
    const validator = validators[name];
    if (!validator) {
      throw unknownOpt(name);
    } else {
      validator(val);
    }
  });
}
