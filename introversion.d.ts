type Conf = object;

interface Tool {
  (...xs: any[]): any;
  with: (conf: Conf) => Tool;
  mute: Tool;
}

interface Api {
  setDefaults: (conf: Conf) => undefined;
  instance: (conf: Conf) => Api;
  logV: Tool;
  logF: Tool;
  logV_: Tool;
  logF_: Tool;
  debV: Tool;
  debF: Tool;
  v: Tool;
  f: Tool;
  v_: Tool;
  f_: Tool;
  time: Tool;
  timeEnd: Tool;
  stopwatch: Tool;
  lap: Tool;
  timeF: Tool;
  timeV: Tool;
  unmute: Tool;
  mute: Tool;
  unmuteF: Tool;
  unmuteV: Tool;
}

declare var api: Api;

export = api;
