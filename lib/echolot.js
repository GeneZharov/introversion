;( function () { "use strict";


var E = {};

var conf = {
    print: console.log.bind(console),
    format: false,
    enumerable: false,
    depth: 2,
    color: true
};


// ================
// Common Utilities
// ================


function getGlobal() {
    return Function("return this")();
}


function getUndefined() {
    return void true;
}


function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}


// Access to the object's content by path.
// gets :: ([String], Object) -> a
function gets(path, obj) {
    var val = obj[path.shift()];
    if (path.length) {
        if (val === null || typeof val !== "object") {
            throw new Error("Not existing path: " + path);
        } else {
            return gets(path, val);
        }
    } else {
        return val;
    }
}


function getKeys(obj) {
    var keys = [];
    for (var i in obj) keys.push(i);
    return keys;
}


function merge(a, b) {
    for (var i in b) { a[i] = b[i]; }
    return a;
}


function fmt(x) {
    var util = require("util");
    return util.inspect(
        x,
        conf.enumerable,
        conf.depth === Infinity ? null : conf.depth,
        conf.color
    );
}


function printLines(xs) {
    xs.forEach( function (x) { conf.print(x); } );
}


// ==================
// Specific Utilities
// ==================


function normalize(_args) {

    var args = toArray(_args);
    var enabled = args[0].enabled || E.enabled;
    var opt = args[0];

    var modes = {
        log: enabled && !opt.deb,
        deb: enabled && opt.deb,
        quiet: opt.quiet
    };

    if (opt.method) {
        var obj = args[args.length - 2];
        var method = args[args.length - 1].split(".").slice(1);
        var self = method.slice(0, -1);
        return merge(modes, {
            data: args.slice(1, -2),
            val:  gets(method, obj),
            this: self.length ? gets(self, obj) : obj
        });
    } else {
        return merge(modes, {
            data: args.slice(1, -1),
            val:  args[args.length - 1],
            this: this
        });
    }

}


function logVal(quiet, data, val) {

    function logFormatted() {
        if (!quiet) data.push(val);
        conf.print("# V");
        conf.print(fmt(data));
        conf.print(); // New line for terminals
    }

    function logTerse() {
        if (!quiet) data.push(val);
        conf.print("V:", data);
    }

    conf.format
        ? logFormatted()
        : logTerse();

}


function logFn(error, quiet, data, args, result) {

    function logFormatted() {
        printLines(["# F", fmt(data)]);
        if (!quiet) {
            var line = "----------";
            var resLabel = error ? "# F ERROR!" : "# F Result";
            printLines([line, "# F Params", fmt(args)]);
            printLines([line, resLabel, fmt(result)]);
        }
        conf.print(); // New line for terminals
    }

    function logTerse() {
        conf.print("F:", data);
        if (!quiet) {
            conf.print("F Params:", args);
            error ? conf.print("F ERROR!:", result)
                  : conf.print("F Result:", result);
        }
    }

    conf.format
        ? logFormatted()
        : logTerse();

}


// ==============
// Core Functions
// ==============


function v() {
    var a = normalize(arguments);
    if (a.log) logVal(a.quiet, a.data, a.val);
    if (a.deb) debugger;
    return a.val;
}


function f() {
    var _args = arguments;
    return function () {
        var a = normalize(_args);
        var args = toArray(arguments);
        try {
            if (a.deb) debugger;
            var result = a.val.apply(a.this, args); // <-- Your function
            if (a.log) logFn(false, a.quiet, a.data, args, result);
            return result;
        } catch (error) {
            if (a.log) logFn(true, a.quiet, a.data, args, error);
            throw error;
        }
    };
}


function deb() {
    E.enabled = true;
}
function off() {
    E.enabled = false;
}


function debF(action) {
    return function () {
        E.enabled = true;
        var result = action.apply(this, arguments);
        E.enabled = false;
        return result;
    };
}


function debV(action) {
    E.enabled = true;
    var result = action();
    E.enabled = false;
    return result;
}


// =================
// Method Shorthands
// =================


function injection() {

    var self = this;

    function call(fn, args) {
        var _args = [].slice.call(args, 0);
        _args.push(self);
        return fn.apply(this, _args);
    }

    return {
        v:  function () { return call(E.v, arguments); },
        f:  function () { return call(E.f, arguments); },
        V:  function () { return call(E.V, arguments); },
        F:  function () { return call(E.F, arguments); },
        v_: function () { return call(E.v_, arguments); },
        f_: function () { return call(E.f_, arguments); },
        mb: {
            v:  function () { return call(E.mb.v, arguments); },
            f:  function () { return call(E.mb.f, arguments); },
            V:  function () { return call(E.mb.V, arguments); },
            F:  function () { return call(E.mb.F, arguments); },
            v_: function () { return call(E.mb.v_, arguments); },
            f_: function () { return call(E.mb.f_, arguments); }
        },
        debF: function () { return call(debF, arguments); }
    };

}


function inject(name) {
    Object.defineProperty(Object.prototype, name, {
        get: injection,
        set: function (value) {
            var self = this !== getUndefined() ? this : getGlobal();
                // Safari does not provide the "window" object as "this"
            Object.defineProperty(self, name, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: value
            });
        }
    });
    return E;
}


// ==========
// Export API
// ==========


E.enabled = false; // If conditional watchers are enabled
E.conf = conf;

E.mb = {};

// Normal mode
E.v     = v.bind(this, {enabled: true});
E.f     = f.bind(this, {enabled: true});
E.m     = f.bind(this, {enabled: true, method: true});
E.mb.v  = v.bind(this, {});
E.mb.f  = f.bind(this, {});
E.mb.m  = f.bind(this, {method: true});

// Quiet mode
E.V     = v.bind(this, {quiet: true, enabled: true});
E.F     = f.bind(this, {quiet: true, enabled: true});
E.M     = f.bind(this, {quiet: true, enabled: true, method: true});
E.mb.V  = v.bind(this, {quiet: true});
E.mb.F  = f.bind(this, {quiet: true});
E.mb.M  = f.bind(this, {quiet: true, method: true});

// Debugger breakpoints
E.v_    = v.bind(this, {deb: true, enabled: true});
E.f_    = f.bind(this, {deb: true, enabled: true});
E.m_    = f.bind(this, {deb: true, enabled: true, method: true});
E.mb.v_ = v.bind(this, {deb: true});
E.mb.f_ = f.bind(this, {deb: true});
E.mb.m_ = f.bind(this, {deb: true, method: true});

E.deb  = deb;
E.off  = off;
E.debF = debF;
E.debV = debV;
E.inject = inject;


// Obtaining the global object
if (typeof module === "object"
 && typeof module.exports === "object"
) {
    conf.format = true;
    conf.color  = process && process.stdout && process.stdout.isTTY;
        // process.stdout is undefined in react-native
    module.exports = E;
} else {
    self.echolot = E;
}


} () );
