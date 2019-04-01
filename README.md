Introversion.js
===============

Tool for debugging JavaScript expressions. Works great with functional code.


Motivation
----------

Suppose you have an arrow function, and you need to check a value inside of 
this function:

```js
const fn = n => n + 1; // what's in "n"?
```

In order to use `console.log()` we'll have to rewrite this function into 
multiple statements:

```js
const fn = n => {
  console.log(n);
  return n + 1;
};
```

Introversion allows you to simply wrap the desired value without rewriting 
anything:

```js
const fn = n => I.v(n) + 1; // log value
// ...or
const fn = I.f(n => n + 1); // log every function call (parameters and return value)
```


Table of Contents
-----------------
* [Installation](#installation)
* [Watchers](#watchers)
    * [`v()`](#v)
    * [`f()`](#f)
    * [`m()`](#m)
* [Timers](#timers)
    * [`time()`, `timeEnd()`](#time-timeEnd)
    * [`stopwatch()`](#stopwatch)
    * [`timeF()`](#timeF)
    * [`timeM()`](#timeM)
    * [`timeRun()`](#timeRun)
* [Modes](#modes)
    * [Quiet mode](#quiet-mode)
    * [Breakpoint mode](#breakpoint-mode)
    * [Guards](#guards)
    * [Mute mode](#mute-mode)
* [Global configuration](#global-configuration)
* [In-place configuration](#in-place-configuration)
* [Options](#options)
* [License](#license)


Installation
------------

```sh
npm install introversion --save-dev
```

Often, it is convenient to setup Introversion in global scope. In order to do 
this include the following script in your main file:

```js
// src/globals.js

import I from "introversion";

I.config({...}); // if necessary
window.I = I; // for browser
global.I = I; // for node
```

If you are using Introversion in [Jest](https://jestjs.io) unit tests:

```json
// package.json

"jest": {
  "setupFiles": ["<rootDir>/src/globals.js"]
}
```


Watchers
--------

### `v()`

`I.v()` (“v” stands for “value”) merely prints an array of its arguments. The 
main difference between `console.log()` is that the last argument is returned. 
Therefore it is safe to wrap almost any expression in `I.v()` without breaking 
your code down.

```js
const random = n => Math.floor(I.v(Math.random()) * n) + 10;
random(1); //=> V: [ 0.504418952113608 ]
```

You can print any other values alongside with the wrapped expression. Just pass 
them as arguments. Only the last argument is returned, so extra arguments won't 
affect your code:

```js
const random = n => Math.floor(I.v(num, this, "mystr", Math.random()) * n) 10;
random(1); //=> V: [ 1, {}, 'mystr', 0.8474771121023132 ]
```

You can use extra arguments to distinguish different watchers from each other 
in the log:

```js
const fn = n => n > 0 ? I.v(true, n * 1.25) : I.v(false, n / 9);
fn(5);   //=> V: [ true, 6.25 ]
fn(-81); //=> V: [ false, -9 ]
```

### `f()`

`I.f()` (“f” stands for “function”) is designed to watch for function calls. 
When a wrapped function is called, its arguments and a returned value are 
logged. If a wrapped function throws an exception, that exception will be 
logged and then rethrown again. A wrapped in the `I.f()` function can be used 
in the same way as an unwrapped one: all arguments and a returned value will be 
proxied.

```js
[1, 2].map(I.f(n => 2 * n));

//=> F: []
//=> F Params: [1, 0, [1,2]]
//=> F Result: 2

//=> F: []
//=> F Params: [2, 1, [1,2]]
//=> F Result: 4
```

`I.f()` can also accept additional arguments for printing just like `I.v()` 
does:

```js
I.f("foo", "bar", calculate)(1, 2, 3)

// => F: ["foo", "bar"] <- extra arguments go here
// => F Params: [1, 2, 3]
// => F Result: 999
```

### `m()`

`I.m()` (“m” stands for “method”) is similar to `I.f()`, but it won't corrupt 
`this` inside of a method call. In order to use it, you need to split a method 
call into an object, and a string that represents a path to the method.

```js
A.B.C.method(5); // original call

I.m(A,".B.C.method")(5); // wrapped method
I.m(A.B,".C.method")(5); // ...the same
I.m(A.B.C,".method")(5); // ...one more way to do it
```

The rest behavior does not differ from the `I.f()` watcher.


Timers
------

### time(), timeEnd()
A replacement for `console.time`/`timeEnd()` that use the most accurate source 
of time available:

1. `performance.now()`
2. `console.time`/`timeEnd()`
3. `Date.now()`

```js
I.time(); // start the timer
calculateEverything();
I.timeEnd(); //=> Time: [] 203ms
```

Just like console time methods, these functions accept an optional name for a 
new timer. `timeEnd()` may also accept additional arguments for printing 
alongside with the ellapsed time (not available with `format: false` and 
console methods as a time source).

```js
I.time("label"); // start timer named "label"
calculateEverything();
I.timeEnd("foo", "bar", "label"); //=> Time: [ "foo", "bar", "label" ] 203ms
```

### stopwatch()
When you have a sequence of actions, it is inconvenient to wrap every action in 
`time()...timeEnd()`. In this case stopwatch api is more helpful.

* `stopwatch()` — initially starts the timer.
* `lap([...args])` — prints the ellapsed time since the previous 
  `stopwatch`/`lap()`. Also prints optional arguments and starts a new timer 
  for the next lap.
</a>

```js
I.stopwatch();

createTables();
I.lap("created"); //=> Time: [ "created" ] 15ms

const rows = queryRows();
I.lap("foobar", rows, "queried"); //=> Time: [ "foobar", [], "queried" ] 107ms

populateState(rows);
I.lap("populated"); //=> Time: [ "populated" ] 768ms
```

### timeF()
You can wrap any function with `timeF()`. The result will be a function with 
the same behavior as a wrapped one, but additionally it will print its 
execution time.

```js
array.map(I.timeF(iterator));

//=> Time: [] 4 ms
//=> Time: [] 9 ms
//=> Time: [] 1 ms
```

Optionally you can pass any arguments for printing:

```js
array.map(I.timeF("foo", "bar", iterator));

//=> Time: [ 'foo', 'bar' ] 4 ms
//=> Time: [ 'foo', 'bar' ] 9 ms
//=> Time: [ 'foo', 'bar' ] 1 ms
```

### timeM()
Like `timeF()` but for methods.

```js
// original method call
array.map(n => this.iterator(n));

// wrapped method call
array.map(n => I.timeM(this,".iterator")(n));

//=> Time: [] 4 ms
//=> Time: [] 9 ms
//=> Time: [] 1 ms
```

Optionally you can pass any arguments for printing:

```js
array.map(n => I.timeM("foo", "bar", this,".iterator")(n));

//=> Time: [ 'foo', 'bar' ] 4 ms
//=> Time: [ 'foo', 'bar' ] 9 ms
//=> Time: [ 'foo', 'bar' ] 1 ms
```

### timeRun()

Sometimes you suspect that some expression may be calculated for too long. In 
this case it is convenient to wrap this expression into `timeRun(() => <expr>)` 
that will print the ellapsed time.

```js
// original expression
data = [calculate(src), readState()];

// wrapped expression
data = I.timeRun(() => [calculate(src), readState()]);

//=> Time: [] 349 ms
```

Optionally you can pass any arguments for printing:

```js
data = I.timeRun("data", src, () => [calculate(src), readState()]);

//=> Time: [ 'data', "DATABASE" ] 349 ms
```


Modes
-----

### Quiet Mode

* `I.V()`
* `I.F()`
* `I.M()`

Sometimes you are not interested in a wrapped value itself, but you need to 
know, that it was calculated. For example, in React Native an attempt to log an 
event object may hang the application. Or maybe you are interested only in 
printing additional arguments. For these cases, there are alternative quiet 
mode watchers that don't log wrapped value itself but log all additional 
arguments.

```js
const fn = I.F("Invoked!", n = > n + 1);
fn(2); //=> [ 'Invoked!' ]
```

### Breakpoint Mode

* `I.v_()`
* `I.f_()`
* `I.m_()`

Instead of printing data these functions create a breakpoint using `debugger` 
statement. It can help to look around and walk through the call stack. An 
underscore in function names symbolizes a pause in program execution.

### Guards

### Mute Mode

Imagine, you have a function covered with unit tests. And 1 of 30 tests fails. 
For debugging reasons, it's important to know a value deep inside of that 
function. But if you log that value each time it is evaluated for every unit 
test, there would be hundreds of log entries. In this case, the mute mode comes 
to the rescue.

You can use a muted watcher, that is available for any watcher under the method 
called `mute()` (e.g. `I.v.mute()`, `I.V.mute()`, `I.v_.mute()`, `I.f.mute()`, 
...). Muted watcher doesn't produce any logs or breakpoints unless you 
explicitly unmute it (in the failed unit test for instance).

* `I.unmuteF(fn)` — unmute everything during this function execution
* `I.unmuteRun(() => {...})` — runs passed function and unmutes everything 
  while it is running
* `I.unmute()` — to unmute all the muted functions
* `I.mute()` — to mute everything again

Example:

```js
// module.js
function action(x) {
  // ... big and complicated function
  const y = x * 8;
  return y ^ Math.PI;
}

// module.spec.js
describe("action()", () => {
  // ... lots of unit tests
  it("should perform a complex calculation", () => {
    const res = action(2);
    expect(res).toBe(16);
  });
});
```

First we need to wrap a desired expression in a muted watcher:

```js
// module.js
function action(x) {
  ...
  return I.v.mute(y) ^ Math.PI;
}
```

Then we need to unmute a muted watcher at the desired moment (in the failed 
unit test in this case):

```js
// module.spec.js

// unmute a function
const res = I.unmuteF(action)(2);

// or unmute an expression
const res = I.unmuteRun(() => action(2));

// or unmute anything in a low level imperative style
I.unmute();
const res = action(2);
I.mute();
```


Global Configuration
--------------------

You can pass any number of global options as object properties:

```js
I.config({
  format: false,
  print: (...xs) => xscript.response.write(xs.join(" ") + "\n")
});
```

In-place configuration
----------------------

Every watcher function has a method `with()` for setting temporary local config 
options only for that watcher.

```js
I.v.with({ depth: Infinity })(myobj);
```

Options
-------

* **print**

    `(a, b, c, ...) => string`

    A function that actually prints values to the log.

    *Default:* `(...xs) => console.log(...xs)`

* **timer**
    * `"auto"` — use the most accurate source of time available
    * `"performance"` — use `performance.now()`
    * `"console"` — use `console.time`/`timeEnd()`
    * `"date"` — use `Date.now()`
    * `() => number` — custom user function that returns time in milliseconds

    To offer protection against timing attacks and fingerprinting, the 
    precision of `Date.now()` might get rounded depending on the environment. 
    So consider use of “repeat” option to increase preciseness in this case 
    (see below).

    *Default:* `"auto"`

### Formatting Options

* **format**

    If `true` output values will be formatted with `util.inspect()`.

    *Default:* `true`, if the CommonJS module system is detected

* **showHidden**

    If `true`, object's non-enumerable symbols and properties are included in 
    the formatted result.

    *Default:* `false`

* **depth**

    A number that specifies depth for objects in a log. Use `Infinity` or 
    `null` to print with the maximum depth.

    *Default:* `2`

* **color**

    If `true`, the output will be colored.

    *Default:* `true`, if stdout is connected to a terminal

### In-Place Options

* **id**

    Makes a watcher/timer unique. It helps Introversion to distinguish 
    watchers/timers from each other. This option is required in order to use 
    “guard” options.

    ID can be of any type, but if you are using console as a time source, then 
    the value will be internally converted to a string since it is required by 
    the [console spec](https://console.spec.whatwg.org/#timer-table).

* **guard**

    Sets how may times a watcher or a timer will be functional. After the 
    number of calls exceedes, the call will act just like an original 
    value/function/method without any additional behavior like printing or 
    debugging.

    *Default:* `Infinity`

    ```js
    const fn = I.f.with({ id: 0, guard: 1 })(n => n % 2); // prints only once
    [1, 2, 3, 4, 5].map(fn);

    //=> F: []
    //=> F Params: [ 1, 0, [ 1, 2, 3, 4, 5 ] ]
    //=> F Result: 1
    ```

* **repeat**

    The number of times a measure will be repeated to make it more precise. 
    Especially useful if you use `Date.now()` as a time source, because its 
    precision is rounded.

    *Default:* 1

    ```js
    I.timeRun.with({ repeat: "5k" })(mergeDatabases);

    //=> Time: [] 0.113ms
    ```


License
-------

MIT
