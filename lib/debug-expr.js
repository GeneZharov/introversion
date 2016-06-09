;( function () { "use strict";


var D = {};


function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
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
    var view = ["V:"].concat(data);
    if (!quiet) view.push(val);
    console.log.apply(console, view);
    console.log(); // New line for terminals
}


function logFn(error, quiet, data, args, result) {
    data.unshift("F:");
    console.log.apply(console, data);
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


D.enabled = false; // If debug was enabled with D.onF() or D.onV()

D.mb = {};

D.v    = v.bind(this, true, "");
D.f    = f.bind(this, true, "");
D.mb.v = v.bind(this, false, "");
D.mb.f = f.bind(this, false, "");

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
