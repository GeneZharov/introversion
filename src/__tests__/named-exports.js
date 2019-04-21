// @flow

import { v, f, setDefaults } from "../index";

const name = 9;
const fn = x => x.name;

const print = jest.fn();

setDefaults({
  print,
  clone: false,
  format: false,
  stackTrace: false
});

afterEach(() => print.mockClear());

describe("should have named exports", () => {
  test("should log with v()", () => {
    const result = v(1, 2, name);
    expect(result).toBe(name);
    expect(print).toBeCalledWith("v()", [1, 2, name]);
  });
  test("should log with f()", () => {
    const result = f(1, 2, fn)({ name });
    expect(result).toBe(name);
    expect(print.mock.calls.length).toEqual(3);
    expect(print).toBeCalledWith("f()", [1, 2]);
    expect(print).toBeCalledWith("... Params:", [{ name }]);
    expect(print).toBeCalledWith("... Result:", 9);
  });
});
