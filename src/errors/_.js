// @flow

import { toString } from "ramda";

import type { Task } from "../types/_";

export function errInvalidConfType(task: string): string[] {
  return [`${task}() argument must be object`];
}

export function errExpectedFuncArg(task: Task): string[] {
  return [`${task}() expected function argument`];
}

export function errNotCallableLastArg(task: Task): string[] {
  return [`${task}() last argument is not a function`];
}

export function errTimerIdAlreadyExists(timerID: mixed): string[] {
  return [`Timer id ${toString(timerID)} already exists`];
}

export function errTimerIdDoesNotExist(timerID: mixed): string[] {
  return [`Timer id ${toString(timerID)} does not exist`];
}
