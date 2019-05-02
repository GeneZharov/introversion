// @flow

export type Suffix = "K" | "M" | "G";

export const SUFFIX_KILO = "K";
export const SUFFIX_MEGA = "M";
export const SUFFIX_GIGA = "G";

export function errMustBeNumber() {
  return new Error("Argument must be a number");
}

export function errMustBeString() {
  return new Error("Argument must be a string");
}

const options = [
  [10 ** 9, SUFFIX_GIGA],
  [10 ** 6, SUFFIX_MEGA],
  [10 ** 3, SUFFIX_KILO]
];

function filterOptions(suffixes: Suffix[]): Array<[number, Suffix]> {
  return options.filter(([, s]) => suffixes.indexOf(s) !== -1);
}

export function formatSuffix(suffixes: Suffix[], num: number): string {
  if (typeof num !== "number") {
    throw errMustBeNumber();
  }
  if (num !== Infinity) {
    for (let [group, suffix] of filterOptions(suffixes)) {
      if (Math.abs(num) >= group) {
        return (num / group).toString() + suffix;
      }
    }
  }
  return num.toString();
}

export function parseSuffix(suffixes: Suffix[], str: string): number {
  if (typeof str !== "string") {
    throw errMustBeString();
  } else if (str.length === 0) {
    return NaN;
  } else if (str.length === 1) {
    return +str;
  } else {
    const c = str[str.length - 1];
    const match = filterOptions(suffixes).find(([, suffix]) => {
      return suffix.toLowerCase() === c.toLowerCase();
    });
    return match ? +str.slice(0, -1) * match[0] : +str;
  }
}
