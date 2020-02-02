// @flow

export type State = {
  muted: boolean,
  guard: Map<mixed, number>,
  timers: Map<mixed, number>,
  ...
};
