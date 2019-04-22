// @flow

export function getGlobal(): mixed {
  return (Function: any)("return this")();
}
