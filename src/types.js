// @flow

export type Timer =
  | "auto"
  | "performance"
  | "console"
  | "date"
  | (() => number);

export type Conf = {
  print: (...args: mixed[]) => void,
  timer: Timer,

  // util.inspect options
  format: boolean,
  showHidden: boolean,
  depth: number,
  color: boolean,

  // in-place options
  id: string,
  guard: number,
  repeat: number | string
};

export type State = {
  muted: boolean,
  guard: Map<mixed, number>,
  timers: Map<mixed, number>
};

export type Modes = {
  quiet: boolean,
  method: boolean,
  deb: boolean,
  mute: boolean
};
