Echolot.js
==========

It is a library for debugging JavaScript expressions. It is especially useful 
for a code in a functional style.

Motivation
----------

Traditional JavaScript debugging tools are applicable to statements. For 
example you can insert a `debugger` statement; or you can create a breakpoint 
on a statement in a debugger window. There are several ways to print a value, 
for example `console.log()`, but usually these functions should be inserted in 
code as separate statements.

Echolot offers tools for a more flexible debugging, for debugging expressions, 
that construct statements. This allows not to split an expression into separate 
statements for debugging purpose.

Suppose you have a function:

    const calc = x => x + 1;

If you wish to know an "x" value, you have to rewrite this function in an 
imperative style, as a set of statements:

    const calc = x => {
        console.log(x);
        return x + 1;
    };

Echolot allows not to waste time on it and not to break the functional 
paradigm. For example, here are 2 ways to solve the same problem:

    const calc = x => E.v(x) + 1; // Print the "x" expression
    const calc = E.f(x => x + 1); // Print parameters and a return value of an arrow function

More complex example with the use of the functional library called
[Ramda](http://ramdajs.com):

    // extract :: [[Item]] -> [a]
    //   Item = {enabled: Boolean, raw: a}
    const extract = R.pipe(
        R.map(R.last),
        E.f(R.filter(R.prop("enabled"))), // Print what is passed on the second pipe's step
        R.map(R.prop("raw"))
    );
    $http.post("myURL" extract(links));


Install
-------
With a package manager:

    npm install echolotjs --save-dev
    bower install echolotjs --save-dev


Initialization
--------------
This is a recommended way to initialize the library for a big project:

    // In browser
    window.E = echolot;

    // In Node.js
    global.E = require("echolot");

If you have just a few scripts, or if you don't want to waste the global scope, 
you can assign into a local scope:

    // In browser
    const E = echolot;

    // In Node.js
    const E = require("echolot");


Watching a Value
----------------
`E.v()` ("v" stands for "value") merely prints an array of values passed as 
arguments. The main difference from `console.log()` is that the last argument 
becomes a returned value. This lets you to safely wrap any value in the 
`E.v()`.

Suppose you have a function and it's call:

    const random = x => Math.floor(Math.random() * x) + 10;
    random(1);

You can wrap in the `E.v()` any value in the expression:

    const random = x => Math.floor(E.v(Math.random()) * x) + 10;
    random(1); //=> V: [ 0.504418952113608 ]

It is possible to add any other values for printing:

    const random = x => Math.floor(E.v(x, this, "mystr", Math.random()) * x) + 10;
    random(1); //=> V: [ 1, {}, 'mystr', 0.8474771121023132 ]

It can be especially useful, if there are several watchers at the same time, 
and you need a way to distinguish their output from each other:

    const fn = x => x > 0 ? E.v(x * 1.25) : E.v(x / 9);

Then you can pass any marker as a first argument, a string, for example:

    const fn = x => x > 0 ? E.v("positive", x * 1.25) : E.v("negative", x / 9);
    fn(5);   //=> V: [ 'positive', 6.25 ]
    fn(-81); //=> V: [ 'negative', -9 ]

But usually it is more convenient to merely use digits:

    const fn = x => x > 0 ? E.v(0, x * 1.25) : E.v(1, x / 9);
    fn(5);   //=> V: [ 0, 6.25 ]
    fn(-81); //=> V: [ 1, -9 ]


Watching a Function
-------------------
`E.f()` ("f" stands for "function") is designed to watch for a function. It is 
used for printing arguments and a returned value each time a function is 
called. If a function throws an exception, this exception will be printed and 
then rethrown again. A wrapped in the `E.f()` function can be used in the same 
way as an unwrapped one: all arguments and a returned value will be proxied.

Suppose you have:

    const transform = x => 2 * x;
    const arr = [1, 2, 3];
    const result = arr.map(transform);

Now you can wrap the function in the `E.f()` call to obtain a new function with 
the same behavior but it will additionally print information about it's calls.

    const result = arr.map(E.f(transform));

    //=> F: []
    //=> F Params: [1, 0, [1,2,3]]
    //=> F Result: 2

    //=> F: []
    //=> F Params: [2, 1, [1,2,3]]
    //=> F Result: 4

    //=> F: []
    //=> F Params: [3, 2, [1,2,3]]
    //=> F Result: 6

`E.f()` can accept any additional values for printing that will be printed with 
the information about a function call, just like `E.v()` do. But the last 
argument must always be a function that you want to watch and get a return 
value from.

    const myvar = true;
    const result = arr.map(E.f(1, "mystr", myvar, transform));

    //=> F: [1, "mystr", true]
    //=> F Params: [1, 0, [1,2,3]]
    //=> F Result: 2

    //=> F: [1, "mystr", true]
    //=> F Params: [2, 1, [1,2,3]]
    //=> F Result: 4

    //=> F: [1, "mystr", true]
    //=> F Params: [3, 2, [1,2,3]]
    //=> F Result: 6


Watching a Method
-----------------
`E.m()` ("m" stands for "method") is similar to `E.f()`, but it let's to pass 
`this` inside, so it can be applied to a method that needs a correct `this`. 
`E.f()` would cause an error in such case.

If you have a method call:

    o1.o2.o3.method(5)

Then you need to split this expression to an object and a string that 
represents a path to the method inside that object. The following calls produce 
the same result:

    E.m(o1,".o2.o3.method")(5);
    E.m(o1.o2,".o3.method")(5);
    E.m(o1.o2.o3,".method")(5);

The rest behaviour is the same as for the `E.f()` function.


Quiet Mode
----------
For all the watching functions (`E.v()`, `E.f()`, `E.m()`) and their 
conditional alternatives (`E.mb.v()`, `E.mb.f()`, `E.mb.m()`) there are 
modified versions with the name in an upper case (`E.V()`, `E.F()`, `E.M()`, 
`E.mb.V()`, `E.mb.F()`, `E.mb.M()`). They do the same job except of printing 
the last accepted argument. This means that their purpose is not to print the 
wrapped value, but to print additional arguments. This is useful if you don't 
care about the way a function is called or about its returned value. You just 
need to know if it have been invoked or not.

Suppose you have:

    const fn = x = > x + 1;
    fn();

You had to replace it with:

    const fn = x => {
        console.log("Invoked!");
        return x + 1;
    };
    fn(); //=> Invoked!

But now you can write:

    const fn = E.F("Invoked!", x = > x + 1);
    fn(); //=> [ 'Invoked!' ]

Or even:

    const fn = x = > x + 1;
    E.F("Invoked!", fn)(); //=> [ 'Invoked!' ]


Breakpoint Mode
---------------
For all the watching functions (`E.v()`, `E.f()`, `E.m()`) and their 
conditional alternatives (`E.mb.v()`, `E.mb.f()`, `E.mb.m()`) there are 
modified versions with an underscore appended (`E.v_()`, `E.f_()`, `E.m_()`, 
`E.mb.v_()`, `E.mb.f_()`, `E.mb.m_()`). Instead of printing data to console 
they create a breakpoint with the "debugger" statement. This can help to look 
around and walk through the call stack. An underscore in the function names 
symbolizes the break in a program execution.


Conditional Watchers
--------------------
Suppose you have a JavaScript module and unit tests for it. One of the 30 tests 
fails. You need to know some value that is calculated many times somewhere deep 
inside the module for debugging purposes. But if you print this value each time 
it is evaluated for every test there would be hundreds of records. To avoid 
this mess you should use conditional versions of utilities that resides in an 
object `E.mb` ("mb" stands for "maybe"). By default, these conditional 
utilities (`E.mb.v()`, `E.mb.f()`, `E.mb.m()`, `E.mb.V()`, `E.mb.F()`, 
`E.mb.M()`, `E.mb.v_()`, `E.mb.f_()`, `E.mb.m_()`) do nothing. They need to be 
"enabled" to print some data or to create a breakpoint.

Suppose you have a module and a unit test for it:

    // module.js
    function action(x) {
        // ... big function with a complicated code
        const y = x * 8;
        return y ^ Math.PI;
    }

    // module.spec.js
    describe("action()", () => {
        // ... other tests for the function action()
        it("should perform a complex calculation", () => {
            const res = action(2);
            expect(res).toBe(16);
        });
    });

First you need to wrap a desired expression in a conditional function:

    // module.js
    function action(x) {
        ...
        return E.mb.v(y) ^ Math.PI;
    }

Then you need to "enable" the conditional watcher somewhere in the code. You 
can do it manually with the `E.enabled` flag:

    E.enabled = true;
    const res = action(2);
    E.enabled = false;

Since echolot is a functional library there are functions that perform the same 
job:

    E.deb();
    const res = action(2);
    E.off();

There is a special sugar for enabling conditional watchers inside the function 
call:

    const res = E.debF(action)(2);

And there is also a utility for enabling conditional watchers in an arbitrary 
expression. Though this utility is probably going to be deprecated in the next 
versions.

    const res = E.debV(() => action(2));
        // Enable debugging for the action(2) expression


Shorthands
----------
You can use some functions above as methods of an any object so you don't have 
to waste time on wrapping expressions in parenthesis. For example, instead of:

    this.error = E.f("myerr", dataUtil.ngError)(e.data);

You can edit just a single place in code:

    this.error = dataUtil.ngError.E.f("myerr")(e.data);

To make this available, echolot need to be initialized in a special way:

    window.E = echolot.inject("E"); // In browser
    global.E = require("echolot").inject("E"); // In Node.js

`inject()` adds methods to the `Object` prototype and returns an ordinary set 
of functions that Echolot usually exports. It accepts a name that is placed in 
the prototype. This name is safely added with the `enumerable: false` flag.

A list of implemented methods:

    E.v(name)  <=> name.E.v()
    E.f(func)  <=> func.E.f()
    E.V(name)  <=> name.E.V()
    E.F(func)  <=> func.E.F()
    E._v(name) <=> name.E._v()
    E._f(func) <=> func.E._f()

    E.mb.v(name)  <=> name.E.mb.v()
    E.mb.f(func)  <=> func.E.mb.f()
    E.mb.V(name)  <=> name.E.mb.V()
    E.mb.F(func)  <=> func.E.mb.F()
    E.mb._v(name) <=> name.E.mb._v()
    E.mb._f(func) <=> func.E.mb._f()

Be careful with `null` and `undefined`. It can't be converted into an object so 
an attempt to call its methods will cause a TypeError.


Options
-------
`E.conf` is an object with options.

### print
    print :: (a, b, c, ...) -> String

It is a function for printing data. Defaults to `console.log`.

### format
    format :: Boolean

If `true` output will be specially formatted by nodejs with the "util" package. 
Defaults to `true` if the node's module system is found.

* * *

Options below take place only if `E.conf.format === true`

### enumerable
    enumerable :: Boolean

If `true`, object's enumerable symbols and properties will be printed. Defaults 
to `false`.

### depth
    depth :: Number

Specifies the depth of objects that you want to see in output. Pass `Infinity` 
to print with the maximum depth. Defaults to `2`.

### color
    color :: Boolean

If `true` the output will be colored.
It is set automaticaly if stdout is connected to a terminal.
