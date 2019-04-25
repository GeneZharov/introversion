// @flow

// Has less function calls than R.once() that allowes to keep the stack trace
// shorter (especially important for nodejs).

export function once<T: Function>(fn: T): T {
  let done = false;
  let result;
  return (function(...args) {
    if (!done) {
      result = fn.apply(this, args);
      done = true;
    }
    return result;
  }: any);
}
