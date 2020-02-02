// @flow

import { state } from "../../state";

export function getGuard(id: mixed, guard: number): number {
  if (guard === Infinity) {
    return Infinity;
  } else {
    const _guard = state.guard.get(id);
    return typeof _guard === "undefined" ? guard : _guard;
  }
}

export function saveGuard(id: mixed, guard: number): void {
  if (guard > 0 && guard < Infinity) {
    state.guard.set(id, guard - 1);
  }
}
