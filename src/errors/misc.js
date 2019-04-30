// @flow

import { toString } from "ramda";

export function errInvalidConfType(task: string): string[] {
  return [`${task}() argument must be object`];
}

export function errExpectedFuncArg(task: string): string[] {
  return [`${task}() expected function argument`];
}

export function errNotCallableLastArg(task: string): string[] {
  return [`${task}() last argument is not a function`];
}

export function errNotObjLastArg(task: string): string[] {
  return [`${task}() last argument is not an object`];
}

export function errTimerIdAlreadyExists(timerID: mixed): string[] {
  return [`Timer id ${toString(timerID)} already exists`];
}

export function errTimerIdDoesNotExist(timerID: mixed): string[] {
  return [`Timer id ${toString(timerID)} does not exist`];
}

export function errInvalidPropName(): string[] {
  return ["Not valid property name"];
}
