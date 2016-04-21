;( function () { 'use strict';


function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}


// Normalize arguments
function normalize(a) {
    return a.length === 2
        ? { break: a[0], data: a[1] }
        : { break: a[0], id: a[1], data: a[2] };
}


function logVal(id, val) {
    console.log(
        id === undefined
            ? 'V:'
            : 'V-' + id + ':',
        val
    );
    console.log(); // New line for terminals
}


function logFn(id, args, result, error) {
    var name = id === undefined ? 'F' : 'F-' + id;
    console.log(name + ' Params:', args);
    error ? console.log(name + ' ERROR!:', error)
          : console.log(name + ' Result:', result);
    console.log(); // New line for terminals
}


// val :: (Boolean, a?, b) -> b
function val() {
    var a = normalize(arguments);
    var id = a.id;
    var args = a.data;
    logVal(id, args);
    if (a.break) {
        id;   // Passed ID
        args; // Passed value
        debugger; // Check your value
    }
    return args;
}


// Val :: (Boolean, a?, b) -> b
function Val() {
    var a = normalize(arguments);
    var id = a.id;
    var args = a.data;
    if (debug) {
        logVal(id, args);
        if (a.break) {
            id;   // Passed ID
            args; // Passed value
            debugger; // Check your value
        }
    }
    return args;
}


// fn :: (Boolean, a?, (b, ..., n) -> x) -> (b, ..., n) -> x
function fn() {
    var a = normalize(arguments);
    var id = a.id;
    var userFunc = a.data;
    return function () {
        var args = toArray(arguments);
        try {
            if (a.break) {
                id;   // Passed ID
                args; // Passed args
                debugger;
            }
            var result = userFunc.apply(this, args); // <-- Your function
            logFn(id, args, result);
            return result;
        } catch (error) {
            logFn(id, args, error);
            throw error;
        }
    };
}


// Fn :: (Boolean, a?, (b, ..., n) -> x) -> (b, ..., n) -> x
function Fn() {
    var a = normalize(arguments);
    var id = a.id;
    var userFunc = a.data;
    return function () {
        var args = toArray(arguments);
        try {
            if (a.break) {
                id;   // Passed ID
                args; // Passed args
                debugger;
            }
            var result = userFunc.apply(this, args); // <-- Your function
            if (debug) logFn(id, args, result);
            return result;
        } catch (error) {
            if (debug) logFn(id, args, null, error);
            throw error;
        }
    };
}


function debugVal(action) {
    debug = true;
    var result = action();
    debug = false;
    return result;
}


function debugFn(action) {
    return function () {
        debug = true;
        var result = action.apply(this, arguments);
        debug = false;
        return result;
    };
}


function offWatch() {
    var a = normalize(arguments);
    return a.data;
}
function offV(action) {
    return action();
}
function offF(action) {
    return function() {
        return action.apply(this, arguments);
    };
}


var debug = false; // If debug was enabled with _onF() or _onV()

// Obtaining global object
var root;
if (typeof module === 'object'
 && typeof module.exports === 'object'
) {
    root = global;
} else {
    root = self;
}

root._v     = val.bind(this, false);
root._v.deb = val.bind(this, true);
root._V     = Val.bind(this, false);
root._V.deb = val.bind(this, true);
root._f     = fn.bind(this, false);
root._f.deb = fn.bind(this, true);
root._F     = Fn.bind(this, false);
root._F.deb = Fn.bind(this, true);

root._v.off = offWatch;
root._V.off = offWatch;
root._f.off = offWatch;
root._F.off = offWatch;

root._onF = debugFn;
root._onV = debugVal;

root._onV.off = offV;
root._onF.off = offF;


} () );
