// @flow

export type Conf = {
  print: (...args: mixed[]) => void,
  format: boolean,
  showHidden: boolean,
  depth: number,
  color: boolean,
  times: number
};

export type State = {
  times: Map<mixed, number>,
  muted: boolean
};

export type Modes = {
  quiet: boolean,
  method: boolean,
  deb: boolean,
  mute: boolean
};

export type Task = {
  conf: Conf,
  log: boolean,
  deb: boolean,
  quiet: boolean,
  extras: mixed[],
  val: *,
  self: mixed
};
