Introversion.js
===============

Swiss army knife for debugging JavaScript expressions and performance 
measurements. A wrapper around `console.log()`, `performance.now()`, 
`debugger`, etc. with essential benefits:

* works great with functional code (built for [React](https://reactjs.org/), 
  [Redux](https://redux.js.org/), [Ramda](https://ramdajs.com/), 
  [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide), etc.)
* pretty and colorful output
* easy to use:
    * automatically chooses the best time source available (`performance.now()` 
      or `console.time()` or `Date.now()`)
    * logged objects are deeply cloned to prevent confusing results in DevTools
    * many tools for various scenarios


Table of Contents
-----------------
* [Motivation](#motivation)
* [Installation](#installation)
* [Watchers](#watchers)
    * [`logV()`](#logV)
    * [`logF()`](#logF)
* [Timers](#timers)
    * [`time()`, `timeEnd()`](#time-timeEnd)
    * [`stopwatch()`](#stopwatch)
    * [`timeF()`](#timeF)
    * [`timeRun()`](#timeRun)
* [Modes](#modes)
    * [Quiet mode (`logV_()`, `v_()`...)](#quiet-mode)
    * [Breakpoint mode (`debV()`, ...)](#breakpoint-mode)
    * [Guards](#guards)
    * [Mute mode (`.mute`)](#mute-mode)
* [Configuration](#configuration)
    * [Default configuration (`setDefaults()`)](#default-configuration)
    * [Instance configuration (`instance()`)](#instance-configuration)
    * [In-place configuration (`.with()`)](#in-place-configuration)
* [Options](#options)
    * [General options](#general-options)
    * [Formatting options](#formatting-options)
    * [Stack trace options](#stack-trace-options)
    * [In-place options](#in-place-options)
* [Advanced installation](#advanced-installation)
    * [Default import](#default-import)
    * [Set up in global variable](#set-up-in-global-variable)
    * [Zero-conf for Node.js](#zero-conf-for-nodejs)
* [License](#license)


Motivation
----------

Suppose you have an arrow function, and you need to know some value inside:

```js
const fn = n => n + 1; // what's in “n”?
```

In order to use `console.log()` you’ll have to rewrite this function into 
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
const fn = n => logV(n) + 1; // log value
// ...or
const fn = logF(n => n + 1); // log every function call (arguments and return value)
```


### React Component
A real-world example of a functional React component that makes you hate 
`console.log()`.

```js
...
renderSuggestion={item => (
  <MenuItem
    text={logV(item).name}
    onClick={_ => this.toggle(item.id)}
  />
)}
```


### Performance

Imagine you need to check if a function call is fast enough to decide whether 
you need to cache it somewhere. With Introversion you can do it by simply 
wrapping the desired expression in `timeRun(() => <expr>)` right in JSX:

```js
// before
<Select options={states.map(transform) /* is map() too slow? */} />

// after
<Select options={timeRun(() => states.map(transform)) /* prints 2.73ms */} />
```


### Functional Programming

Since Introversion is functional, it tries not to interfere in the program’s 
logic, but to seamlessly proxy input and output values, so it makes it easy to 
debug functional code. For example, to research a function composition for 
issues.

```js
import { pipe, groupBy, omitBy, mapValues } from "lodash/fp";

const build = pipe([
  groupBy(o => o.key),
  logF(omitBy(x => x.length > 1)), // print what goes on the 2nd step and what comes out
  mapValues(([o]) => o.uuid)
]);
```


Installation
------------

```sh
npm install introversion --save-dev
```

```js
import { logV } from "introversion";

logV(val);
```

Advanced installation cases are described below ([Default 
import](#default-import), [Set up in global 
variable](#set-up-in-global-variable), [Zero-conf for 
Node.js](#zero-conf-for-nodejs))


Watchers
--------

### logV()

*Alias:* `v()` (helpful with default import: `In.v()`)

`logV()` (“v” stands for “value”) merely prints an array of its arguments. The 
main difference between `console.log()` is that the last argument is returned. 
Therefore it is safe to wrap any expression in `logV()` without breaking your 
code down.

```js
const random = n => Math.floor(logV(Math.random()) * n) + 10;
random(1); //=> logV() [ 0.5909956243063763 ]
```

You can print any other values alongside with the wrapped expression. Just pass 
them as arguments. Only the last argument is returned so that extra arguments 
won’t affect your code:

```js
const random = n => Math.floor(logV(num, this, "mystr", Math.random()) * n) 10;
random(1); //=> logV [ 1, {}, 'mystr', 0.8474771121023132 ]
```

You can use extra arguments to distinguish different watchers from each other 
in the log:

```js
const fn = n => n > 0 ? logV(true, n * 1.25) : logV(false, n / 9);
fn(5);   //=> logV [ true, 6.25 ]
fn(-81); //=> logV [ false, -9 ]
```

### logF()

*Alias:* `f()` (helpful with default import: `In.f()`)

`logF()` (“f” stands for “function”) is designed for watching for function 
calls. When a wrapped function is called, its arguments and a returned value 
are logged. If a wrapped function throws an exception, that exception will be 
logged and then rethrown again. A wrapped in the `logF()` function can be used 
in the same way as an unwrapped one: all arguments, `this` and a returned value 
will be proxied.

```js
[1, 2].map(logF(n => 2 * n));

//=> logF()
//=> ... Params: [ 1, 0, [ 1, 2 ] ]
//=> ... Result: 2

//=> logF()
//=> ... Params: [ 2, 1, [ 1, 2 ] ]
//=> ... Result: 4
```

`logF()` can also accept additional arguments for printing just like `logV()` 
does:

```js
logF("foo", "bar", calculate)(1, 2, 3)

// => logF() [ "foo", "bar" ] <- extra arguments go here
// => ... Params: [ 1, 2, 3 ]
// => ... Result: 999
```

Timers
------

### time(), timeEnd()
A replacement for `console.time`/`timeEnd()` that use the most accurate source 
of time available:

1. `performance.now()`
2. `console.time`/`timeEnd()`
3. `Date.now()`

```js
time(); // start the timer
calculateEverything();
timeEnd(); // stop the timer

//=> timeEnd() 203 ms
```

Just like console timing methods, these functions accept an optional name for a 
new timer. `timeEnd()` may also take additional arguments for printing 
alongside with the elapsed time (not available with `format: false` and console 
methods as a time source).

```js
time("label"); // start the timer named "label"
calculateEverything();
timeEnd("foo", "bar", "label"); // stop the timer named "label"

//=> timeEnd() [ 'foo', 'bar', 'label' ] 203 ms
```

### stopwatch()
When you have a sequence of actions, it is inconvenient to wrap every action in 
`time()...timeEnd()`. In this case, stopwatch API is more helpful.

* `stopwatch()` — initially starts the timer.
* `lap([...args])` — prints the elapsed time since the previous 
  `stopwatch`/`lap()`. Also prints optional arguments and starts a new timer 
  for the next lap.
</a>

```js
stopwatch();

createTables();
lap("created"); //=> lap() [ 'created' ] 15 ms

const rows = queryRows();
lap("foobar", rows, "queried"); //=> lap() [ 'foobar', [], 'queried' ] 107 ms

populateState(rows);
lap("populated"); //=> lap() [ 'populated' ] 768 ms
```

### timeF()
You can wrap any function with `timeF()`. The result will be a function with 
the same behavior as a wrapped one, but additionally, it will print the 
execution time of its synchronous code.

```js
array.map(timeF(iterator));

//=> timeF() 4 ms
//=> timeF() 9 ms
//=> timeF() 1 ms
```

Optionally you can pass any arguments for printing:

```js
array.map(timeF("foo", "bar", iterator));

//=> timeF() [ 'foo', 'bar' ] 4 ms
//=> timeF() [ 'foo', 'bar' ] 9 ms
//=> timeF() [ 'foo', 'bar' ] 1 ms
```

### timeRun()

Sometimes you suspect that some expression may be calculated for too long. In 
this case it is convenient to wrap this expression into `timeRun(() => <expr>)` 
that will print the elapsed time.

```js
// original expression
data = [calculate(src), readState()];

// wrapped expression
data = timeRun(() => [calculate(src), readState()]);

//=> timeRun() 349 ms
```

Optionally you can pass any arguments for printing:

```js
data = timeRun("data", src, () => [calculate(src), readState()]);

//=> timeRun() [ 'data', 'DATABASE' ] 349 ms
```


Modes
-----

### Quiet Mode

* `logV_()`, *alias:* `v_()`
* `logF_()`, *alias:* `f_()`

Sometimes you are not interested in a wrapped value itself, but you need to 
know, that it was calculated. For example, in React Native an attempt to log an 
event object may hang the application. Or maybe you are interested only in 
printing additional arguments. For these cases, there are alternative quiet 
mode watchers that don’t log wrapped value itself but log all additional 
arguments.

```js
const fn = logF_("Invoked!", n => n + 1);
fn(2); //=> logF_() [ 'Invoked!' ]
```

### Breakpoint Mode

* `debV()`
* `debF()`

Instead of printing data, these functions create a breakpoint using `debugger` 
statement. It can help to look around and walk through the call stack.

### Guards
Sometimes a watcher can produce too many outputs if it is called for too many 
times. You may want to suppress excess outputs. Perhaps you need only the first 
one or first ten outputs. In this case, the in-place “guard” option may help. 
It specifies the number of times a watcher will be active. After this amount 
runs out, it will merely proxy values without any side effects. More about the 
[in-place configuration](#in-place-configuration) is described below.

```js
for (let i = 0; i < 1000; i++) {
  logV.with({ guard: 1 })(i); // prints only once
}
```

Guards need some way to distinguish one call from another to keep track of the 
amount of executed calls. So if you have more than one guard, you need to 
explicitly identify a call with the “id” option:

```js
for (let i = 0; i < 1000; i++) {
  logV.with({ id: 1, guard: 1 })(i); // prints only once
  logV.with({ id: 2, guard: 10 })(arr[i]); // prints for the first 10 times
}
```

### Mute Mode

Imagine, you have a function covered with unit tests. And 1 of 30 tests fails. 
For debugging reasons, it’s important to know a value deep inside of that 
function. But if you log that value each time it is evaluated for every unit 
test, there would be hundreds of log entries. In this case, the mute mode comes 
to the rescue.

You can use a muted watcher, that is available for any watcher under the 
property called `.mute` (e.g. `logV.mute()`, `logV_.mute()`, `debV.mute()`, 
`logF.mute()`, ...). Muted watcher doesn’t produce any logs or breakpoints 
unless you explicitly unmute it (in the failed unit test for instance).

* `unmuteF(fn)` — unmute everything during this function execution
* `unmuteRun(() => <expr>)` — runs passed function and unmutes everything while 
  it is running
* `unmute()` — unmute all the muted functions
* `mute()` — mute everything again

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

First, we need to wrap the desired expression in a muted watcher:

```js
// module.js
function action(x) {
  ...
  return logV.mute(y) ^ Math.PI;
}
```

Then we need to unmute a muted watcher at the desired moment (in the failed 
unit test in this case):

```js
// module.spec.js

// unmute a function
const res = unmuteF(action)(2);

// or unmute an expression
const res = unmuteRun(() => action(2));

// or unmute anything in a low level imperative style
unmute();
const res = action(2);
mute();
```


Configuration
-------------

### Default Configuration

You can pass any number of default options as object properties:

```js
setDefaults({
  format: false,
  log: (...xs) => Reactotron.log(xs),
  warn: (...xs) => Reactotron.warn(xs)
});
```

### Instance Configuration

You can have many instances of Introversions with different configurations:

```js
const InR = instance({
  format: false,
  log: (...xs) => Reactotron.log(xs),
  warn: (...xs) => Reactotron.warn(xs)
});

const InX = instance({
  format: false,
  log: (...xs) => xscript.response.write(xs.join(" ") + "\n"),
  warn (...xs) => xscript.response.write(xs.join(" ") + "\n")
})

InR.logV(val);
InX.logV(val);
```

### In-Place Configuration

Most functions have a method `with()` for setting temporary local configuration 
options only for this call.

```js
logV.with({ depth: Infinity })(myobj);
```

Options
-------

### General Options

* **log**

    A function that accepts any number of any arguments and prints them to the 
    log.

    *Default:* `(...xs) => console.log(...xs)`

    *Examples:*

    ```js
    (...xs) => Reactotron.log(xs)
    (...xs) => xscript.response.write(xs.join(" ") + "\n")
    ```

* **warn**

    A function that accepts any number of any arguments and prints them as 
    warnings to the log.

    *Default:* `(...xs) => console.warn(...xs)`

    *Example:*

    ```js
    (...xs) => Reactotron.warn(xs)
    ```

* **timer**

    * `"auto"` — use the most accurate source of time available
    * `"performance"` — use `performance.now()`
    * `"console"` — use `console.time`/`timeEnd()`
    * `"date"` — use `Date.now()`
    * `() => number` — custom user function that returns time in milliseconds

    To offer protection against timing attacks and fingerprinting, the 
    precision of `Date.now()` might get rounded depending on the environment. 
    So consider the use of “repeat” option to increase preciseness in this 
    case.

    *Default:* `"auto"`

* **clone**

    * `"auto"` — clone all the values before printing if DevTools are detected
    * `true`/`false` — whether to deeply clone all values for printing

    *Default:* `"auto"`

* **errorHandling**

    * `"warn"` — output errors as warnings and try to fall back on the default 
      behavior
    * `"throw"` — always throw an exception on error

    *Default:* `"warn"`

* **devTools**

    For some options, it is important if DevTools are connected to the program. 
    Introversion tries to detect DevTools with a test output to the log. To 
    skip it, you can explicitly specify presence of DevTools with this option. 
    Or you can explicitly specify all the options that depend on DevTools 
    (currently these are “clone”, “format”, “formatErrors”).

    * `"auto"` — detect DevTools with a test output to the log
    * `true`/`false` — whether DevTools are connected

    *Default:* `"auto"`

* **dev**

    If `true` Introversion utilities additionally print a configuration object 
    they are using and a stack trace including the detected user code position 
    in it that is useful for configuring “stackTraceShift” option.

    *Default:* `false`

### Formatting Options

* **format**

    * `"auto"` — detect the environment
    * `true` — optimized for browsers and sophisticated tools like DevTools
    * `false` — optimized for text output, e.g., to a terminal by Node.js

    When “format” is enabled:

    * stringifies printed objects in a pretty way
    * Only a single `log()` call is made with a single formatted string as an 
      argument
    * empty line after each output

    Not formatted output:

    ```
    logF() at myfunc (index.js:10:23)
    ... Params: [ 1, 0, [ 1, 2, 3 ] ]
    ... Result: 1
    ```

    Formatted output:

    ```
    logF() at myfunc (index.js:10:23)
    --- Params ---
    [ 1, 0, [ 1, 2, 3 ] ]
    --- Result ---
    1
    ```

    *Default:* `"auto"`

* **formatErrors**

    Similar to the “format” option, but for errors and warnings.

    * `"auto"` — detect the environment
    * `true` — optimized for browsers and sophisticated tools like DevTools
    * `false` — optimized for text output, e.g., to a terminal by Node.js

    Not formatted output:

    ```
    Introversion Warning

    Unknown option stakcTrace
    ```

    Formatted output:

    ```
    ▒  Introversion
    ▒
    ▒  Unknown option stakcTrace
    ▒
    ▒  at validateConf (introversion.js:780:7)
    ▒  at (introversion.js:898:31)
    ▒  at Object.<anonymous> (index.js:35:4)
    ▒  at Module._compile (loader.js:723:30)
    ▒  at Object.Module._extensions..js (loader.js:734:10)
    ▒  at Module.load (loader.js:620:32)
    ▒  at tryModuleLoad (loader.js:560:12)
    ```

    *Default:* `"auto"`

* **highlight**

    If `true`, Introversion will try to highlight the output for terminals.

    *Default:* `"auto"`

* **inspectOptions**

    Options that will be proxied to the node’s `util.inspect()`

    *Default:* `"auto"`

* **precision**

    Number of digits after the point for the time measured by 
    [timers](#timers).

    *Default:* `2`

### Stack Trace Options

* **stacktrace**

    In order to distinguish one output from another Introversion logs function 
    name, file name, line and column numbers of a line where the user called an 
    Introversion function. What exactly will be printed is configured with this 
    option using an array of keywords.

    * `"auto"` — depends on the environment
    * `Array<"func" | "file" | "line" | "col">`
    * `true` — print everything, shorthand for `["func", "file", "line", "col"]`
    * `false` — print nothing, shorthand for `[]`

    *Default:* `"auto"`

* **stackTraceAsync**

    * `"auto"` — try to log asynchronously if available.
    * `true` — print to the log asynchronously. It allows the use of source 
      maps and guess anonymous functions but will trigger network requests for 
      source maps.
    * `false` — synchronous behavior, won’t use source maps or guess anonymous 
      functions.

    *Default:* `"auto"`

* **stackTraceShift**

    Introversion knows at what depth in the stack trace the user function call 
    should be located. But on some platforms Introversion module can be wrapped 
    in something. For instance React Native increases stack trace depth by 1. 
    Therefore, Introversion may mistake with the location of the user function 
    call. This option helps to correct this mistake.

    ```js
    logV.with({ dev: true })
    // ...
    // --- Dev: stacktrace ---
    //  0  — at getTrace (introversion.js:989:21)
    //  1  — at logVal (introversion.js:1048:3)
    //  2  — at (introversion.js:1414:12)
    //  3  — at (introversion.js:869:12)
    // [4] — at Object.<anonymous> (2.js:5:25)
    //  5  — at Module._compile (loader.js:723:30)
    //  6  — at Object.Module._extensions..js (loader.js:734:10)
    //  7  — at Module.load (loader.js:620:32)
    ```

    You can see that Introversion suppose that user call was in the 4th 
    position, but actually it was in the 5th. So you can set `stackTraceShift: 
    1` to fix it.

    *Default:* `"auto"`

### In-Place Options

* **id**

    Makes a watcher/timer unique. It helps Introversion to distinguish 
    watchers/timers from each other. This option is required in order to use 
    “guard” options.

    ID can be of any type, but if you are using the console as a time source, 
    then the value will be internally converted to a string since it is 
    required by the 
    [console spec](https://console.spec.whatwg.org/#timer-table).

* **guard**

    Sets how many times a watcher or a timer will be functional. After the 
    number of calls exceeds, the call will act just like an original 
    value/function/method without any additional behavior like printing or 
    debugging.

    See [guards](#guards) for a complete description.

    *Default:* `Infinity`

    ```js
    const fn = logF.with({ id: 0, guard: 1 })(n => n % 2); // prints only once
    [1, 2, 3, 4, 5].map(fn);

    //=> logF()
    //=> ... Params: [ 1, 0, [ 1, 2, 3, 4, 5 ] ]
    //=> ... Result: 1
    ```

* **repeat**

    The number of times to repeat the measure in order to increase preciseness. 
    Especially useful with `Date.now()` as a time source, because its precision 
    is rounded.

    The value can be either a number or a string with a special suffix (`"K"`, 
    `"M"`, `"G"`) for big numbers. For example:

    * `"5K"` stands for 5,000
    * `"1.5M"` stands for 1,500,000
    * `"10G"` stands for 10,000,000,000

    *Default:* 1

    ```js
    timeRun.with({ repeat: 5000 })(mergeDatabases);
    // ...or
    timeRun.with({ repeat: "5K" })(mergeDatabases);

    //=> timeRun() 0.113 ms
    ```


Advanced Installation
---------------------

### Default Import

Introversion has a default export:

```js
import In from "introversion";

In.v("foobar");
```

In this case short aliases `v()`, `f()` for `logV()`, `logF()` and their quiet 
alternatives `v_()`, `f_()` are especially helpful.

#### ImportJS

If you use [ImportJS](https://github.com/Galooshi/import-js) and you want it to 
automatically add Introversion as a default import, like in the example above, 
then set the desired alias in the configuration file.

```js
// .importjs.js

module.exports = {
  aliases: { In: "introversion" }
};
```

### Set up in Global Variable

Sometimes, it is convenient to set up Introversion in the global scope. In 
order to do this you can import the following script in your main file:

```js
// src/globals.js

import In from "introversion";

In.setDefaults({...}); // if necessary
window.In = In; // for browser
global.In = In; // for node
```

#### Jest

To make a global variable with Introversion’s API available in 
[Jest](https://jestjs.io) unit tests:

```json
// package.json

"jest": {
  "setupFiles": ["<rootDir>/src/globals.js"]
}
```

#### Flow

If you are using Introversion with [Flow](https://flow.org/), then you’ll have 
to specify the type of the global variable with a libdef file:

```js
// flow-typed/introversion.js

declare var In: any;
```

If you want to specify the shape of the API, then you can copypaste it from the 
[libdef 
script](https://github.com/GeneZharov/introversion/blob/master/introversion.js.flow).

### Zero-Conf for Node.js

Introversion can work with Node.js with no need to initialize or add imports. 
To make API available in scripts you need to run `node` with `-r 
introversion/init` option, that will write API into the global variable `In`.

```sh
node -r introversion/init myfile.js
```

```js
// myfile.js
In.v("working without initialization!");
```

Introversion initialized this way can be configured with environment variables:

* `INTROVERSION_NAME` — the name for the global variable (`In` by default)
* `INTROVERSION_CONF` — js object with the configuration
* `INTROVERSION_CONF_FILE` — path to the CommonJS module that exports the 
  configuration object

Examples:

```sh
INTROVERSION_NAME='I' node -r introversion/init myfile.js
INTROVERSION_CONF='{ stackTrace: false }' node -r introversion/init myfile.js
INTROVERSION_CONF_FILE=~/.introversion-conf.js node -r introversion/init myfile.js
```

You can go further and create an alias for Node with initialized Introversion 
for debugging small scripts that you don’t want to over bloat with extra code. 
You can put these commands in `~/.bashrc`, `~/.zshrc`, etc. Introversion should 
be installed globally in this case.

```sh
npm install -g introversion

alias nodein='node -r introversion/init'
alias babel-nodein='babel-node -r introversion/init'
alias ts-nodein='ts-node -r introversion/init'
...
```


License
-------

MIT
