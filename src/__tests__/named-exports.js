// @flow

import { defaultConf } from "../conf";
import { v, f, setDefaults } from "../index";

const name = 9;
const fn = x => x.name;

const log = jest.fn();

beforeAll(() => {
  setDefaults({
    log,
    devTools: false,
    format: false,
    stackTrace: false
  });
});

afterAll(() => setDefaults(defaultConf));

afterEach(() => log.mockClear());

describe("should have named exports", () => {
  test("should log with v()", () => {
    const result = v(1, 2, name);
    expect(result).toBe(name);
    expect(log).toBeCalledWith("v()", [1, 2, name]);
  });
  test("should log with f()", () => {
    const result = f(1, 2, fn)({ name });
    expect(result).toBe(name);
    expect(log.mock.calls.length).toEqual(3);
    expect(log).toBeCalledWith("f()", [1, 2]);
    expect(log).toBeCalledWith("... Params:", [{ name }]);
    expect(log).toBeCalledWith("... Result:", 9);
  });
});
