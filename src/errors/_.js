// @flow

import type { Task } from "../types/_";

export function expectedFuncArg(task: Task) {
  return new Error(`${task}() expected a function argument`);
}

export function notCallableLastArg(task: Task) {
  return new Error(`${task}() last argument is not a function`);
}
