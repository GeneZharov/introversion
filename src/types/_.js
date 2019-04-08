// @flow

export type WatcherTask = "val" | "fn";

export type TimerTask =
  | "time"
  | "timeEnd"
  | "timeFn"
  | "timeRun"
  | "stopwatch"
  | "lap";

export type MuteTask = "unmuteF" | "unmuteRun";

export type Task = WatcherTask | TimerTask | MuteTask;
