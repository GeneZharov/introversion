// @flow

export function detectStrictMode(): boolean {
  return (function() {
    return !this;
  })();
}
