// @flow

import In from "../../../index";

const print = jest.fn();
const print2 = jest.fn();
const print3 = jest.fn();

afterEach(() => {
  print.mockClear();
  print2.mockClear();
  print3.mockClear();
});

describe(".with()", () => {
  test("should beat setDefaults() and instance()", () => {
    In.setDefaults({
      stackTraceAsync: false,
      print
    });
    const _In = In.instance({
      stackTraceAsync: false,
      print: print2
    });
    _In.v.with({ print: print3 })();
    expect(print).not.toBeCalled();
    expect(print2).not.toBeCalled();
    expect(print3).toBeCalled();
  });
});
