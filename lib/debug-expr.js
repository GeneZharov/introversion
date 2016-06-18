;( function () { "use strict";


var D = {};


function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}


// Access to the object's content by path
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


function normalize(args) {
    args = toArray(args);
    var enabled = args[0] || D.enabled;
    return {
        deb: enabled && args[1] === "deb",
        log: enabled && args[1] !== "deb",
        quiet: args[1] === "q",
        data: args.slice(2, -1),
        val: args[args.length - 1]
    };
}


function logVal(quiet, data, val) {
    if (!quiet) data.push(val);
    console.log("V:", data);
    console.log(); // New line for terminals
}


function logFn(error, quiet, data, args, result) {
    console.log("F:", data);
    if (!quiet) {
        console.log("F Params:", args);
        error ? console.log("F ERROR!:", result)
              : console.log("F Result:", result);
    }
    console.log(); // New line for terminals
}


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
            var result = a.val.apply(this, args); // <-- Your function
            if (a.log) logFn(false, a.quiet, a.data, args, result);
            return result;
        } catch (error) {
            if (a.log) logFn(true, a.quiet, a.data, args, error);
            throw error;
        }
    };
}


function debV(action) {
    D.enabled = true;
    var result = action();
    D.enabled = false;
    return result;
}


function debF(action) {
    return function () {
        D.enabled = true;
        var result = action.apply(this, arguments);
        D.enabled = false;
        return result;
    };
}


function p(enabled, obj, path) {
    var props = path.split('.').slice(1);
    var val = gets(props, obj);
    return v(enabled, "", path, val);
}


function n(enabled, obj) {
    function getKeys(obj) {
        var keys = [];
        for (var i in obj) keys.push(i);
        return keys;
    }
    var keys = getKeys(obj);
    var name = keys[0];
    var val = obj[name];
    return v(enabled, "", name, val);
}


D.enabled = false; // If debug was enabled with D.debF() or D.debV()

D.mb = {};

D.v    = v.bind(this, true, "");
D.f    = f.bind(this, true, "");
D.mb.v = v.bind(this, false, "");
D.mb.f = f.bind(this, false, "");

D.p = p.bind(this, true);
D.n = n.bind(this, true);
D.mb.p = p.bind(this, false);
D.mb.n = n.bind(this, false);

D.V    = v.bind(this, true, "q");
D.F    = f.bind(this, true, "q");
D.mb.V = v.bind(this, false, "q");
D.mb.F = f.bind(this, false, "q");

D.v_    = v.bind(this, true, "deb");
D.f_    = f.bind(this, true, "deb");
D.mb.v_ = v.bind(this, false, "deb");
D.mb.f_ = f.bind(this, false, "deb");

D.debF = debF;
D.debV = debV;


// Obtaining the global object
if (typeof module === "object"
 && typeof module.exports === "object"
) {
    module.exports = D;
} else {
    self.D = D;
}


} () );
