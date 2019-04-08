// @flow

let idNumber = 0;

export function makeID(name: string): string {
  return `timer-${name}`;
}

export function makeCallID(): string {
  return makeID(idNumber.toString());
}
