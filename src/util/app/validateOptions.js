// @flow

export function validTimer(val: mixed): boolean {
  return (
    val === "auto" ||
    val === "performance" ||
    val === "console" ||
    val === "date" ||
    typeof val === "function"
  );
}

export function validLog(val: mixed): boolean {
  return typeof val === "function";
}

export function validWarn(val: mixed): boolean {
  return typeof val === "function";
}

export function validClone(val: mixed): boolean {
  return val === "auto" || typeof val === "boolean";
}

export function validErrorHandling(val: mixed): boolean {
  return val === "warn" || val === "throw";
}

export function validPrecision(val: mixed): boolean {
  return typeof val === "number" && !isNaN(val) && val >= 0;
}

export function validDev(val: mixed): boolean {
  return typeof val === "boolean";
}

export function validStackTrace(val: mixed): boolean {
  return typeof val === "boolean" || Array.isArray(val);
}

export function validStackTraceAsync(val: mixed): boolean {
  return val === "auto" || typeof val === "boolean";
}

export function validStackTraceShift(val: mixed): boolean {
  return typeof val === "number";
}

export function validFormat(val: mixed): boolean {
  return val === "auto" || typeof val === "boolean";
}

export function validFormatErrors(val: mixed): boolean {
  return val === "auto" || typeof val === "boolean";
}

export function validHighlight(val: mixed): boolean {
  return typeof val === "boolean";
}

export function validInspectOptions(val: mixed): boolean {
  return typeof val === "object" || val === null;
}

export function validGuard(val: mixed): boolean {
  return typeof val === "number";
}

export function validRepeat(val: mixed): boolean {
  return typeof val === "number" || typeof val === "string";
}
