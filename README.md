Introversion.js
===============

Tool for debugging JavaScript expressions. Works great with functional code.


Contents
--------
* [Motivation](#motivation)
* [Installation](#installation)
* [Usage](#usage)
    * [Values](#values)
    * [Functions](#functions)
    * [Methods](#methods)
    * [Quiet mode](#quiet-mode)
    * [Breakpoint mode](#breakpoint-mode)
    * [Mute mode](#mute-mode)
* [Configuration](#configuration)
    * [Global configuration](#global-configuration)
    * [In-place configuration](#in-place-configuration)
    * [Options](#options)
* [License](#license)


Motivation
----------

Suppose you have an arrow function, and you need to check a value inside of 
this function:

    const fn = n => n + 1; // what's in "n"?

In order to merely use `console.log()` you'll have to rewrite this function 
into multiple statements:

    const fn = n => {
      console.log(n);
      return n + 1;
    };

Introversion allows you to simply wrap the desired value without rewriting 
anything:

    const fn = n => I.v(n) + 1; // log value
    // ...or
    const fn = I.f(n => n + 1); // log every function call (parameters and return value)


Installation
------------

    npm install introversion --save-dev

Usually, it is convenient to setup Introversion into global scope. In order to 
do this add the following in your main script:

    import I from "introversion";

    I.config({...}); // if necessary
    window.I = I; // for browser
    global.I = I; // for node


Usage
-----

### Values

`I.v()` (“v” stands for “value”) merely prints an array of its arguments. The 
main difference between `console.log()` is that the last argument is returned. 
Therefore it is safe to wrap almost any expression in `I.v()` without breaking 
your code down.

    const random = n => Math.floor(I.v(Math.random()) * n) + 10;
    random(1); //=> V: [ 0.504418952113608 ]

You can print any other values alongside with the wrapped expression. Just pass 
them as arguments. Only the last argument is returned, so extra arguments won't 
affect your code:

    const random = n => Math.floor(I.v(num, this, "mystr", Math.random()) * n) 10;
    random(1); //=> V: [ 1, {}, 'mystr', 0.8474771121023132 ]

You can use extra arguments to distinguish different watchers from each other 
in the log:

    const fn = n => n > 0 ? I.v(true, n * 1.25) : I.v(false, n / 9);
    fn(5);   //=> V: [ true, 6.25 ]
    fn(-81); //=> V: [ false, -9 ]

### Functions

`I.f()` (“f” stands for “function”) is designed to watch for function calls. 
When a wrapped function is called, its arguments and a returned value are 
logged. If a wrapped function throws an exception, that exception will be 
logged and then rethrown again. A wrapped in the `I.f()` function can be used 
in the same way as an unwrapped one: all arguments and a returned value will be 
proxied.

    [1, 2].map(I.f(n => 2 * n));

    //=> F: []
    //=> F Params: [1, 0, [1,2]]
    //=> F Result: 2

    //=> F: []
    //=> F Params: [2, 1, [1,2]]
    //=> F Result: 4

`I.f()` can also accept additional arguments for printing just like `I.v()` 
does:

    I.f("foo", "bar", calculate)(1, 2, 3)

    // => F: ["foo", "bar"] <- extra arguments go here
    // => F Params: [1, 2, 3]
    // => F Result: 999

### Methods

`I.m()` (“m” stands for “method”) is similar to `I.f()`, but it won't corrupt 
`this` inside of a method call. In order to use it, you need to split a method 
call into an object, and a string that represents a path to the method.

    A.B.C.method(5); // original call

    I.m(A,".B.C.method")(5); // wrapped method
    I.m(A.B,".C.method")(5); // ...the same
    I.m(A.B.C,".method")(5); // ...one more way to do it

The rest behavior does not differ from the `I.f()` watcher.

### Quiet Mode

    `I.V()`, `I.F()`, `I.M()`

Sometimes you are not interested in a wrapped value itself, but you need to 
know, that it was calculated. For example, in React Native an attempt to log an 
event object may hang the application. Or maybe you are interested only in 
printing additional arguments. For these cases, there are alternative quiet 
mode watchers that don't log wrapped value itself but log all additional 
arguments.

    const fn = I.F("Invoked!", n = > n + 1);
    fn(2); //=> [ 'Invoked!' ]

### Breakpoint Mode

`I.v_()`, `I.f_()`, `I.m_()`

Instead of printing data to console these functions create a breakpoint using 
`debugger` statement. It can help to look around and walk through the call 
stack. An underscore in function names symbolizes a pause in program execution.

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

    I.unmuteF(fn); // unmute everything during this function execution
    I.unmuteRun(() => {...}); // runs passed function and unmutes everything while it is running
    I.unmute(); // to unmute all the muted functions
    I.mute(); // to mute everything again

Example:

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

First we need to wrap a desired expression in a muted watcher:

    // module.js
    function action(x) {
      ...
      return I.v.mute(y) ^ Math.PI;
    }

Then we need to unmute a muted watcher at the desired moment (in the failed 
unit test in this case):

    // module.spec.js

    // unmute a function
    const res = I.unmuteF(action)(2);

    // or unmute an expression
    const res = I.unmuteRun(() => action(2));

    // or unmute anything in a low level imperative style
    I.unmute();
    const res = action(2);
    I.mute();


Configuration
-------------

### Global Configuration

You can pass any number of global options as object properties:

    I.config({
      format: false,
      print: (...xs) => xscript.response.write(xs.join(" ") + "\n")
    });

### In-place configuration

Every watcher function has a method `with()` for setting temporary local config 
options only for that watcher.

    I.v.with({ depth: Infinity })(myobj);

### Options

#### print
    print :: (a, b, c, ...) => string

A function that actually prints values to the log. Defaults to `console.log`.

#### format
    format :: boolean

If `true` output values will be formatted with `util.inspect()` from Node.js. 
Defaults to `true` if the node's module system is detected.

* * *

Options below are used only if the `format` option is set to `true`.

#### showHidden
    showHidden :: boolean

If true, object's non-enumerable symbols and properties are included in the 
formatted result. Defaults to `false`.

#### depth
    depth :: number

Specifies depth for objects in a log. Use `Infinity` or `null` to print with 
the maximum depth. Defaults to `2`.

#### color
    color :: boolean

If `true`, the output will be colored. It is enabled if stdout is connected to 
a terminal.


License
-------

MIT
