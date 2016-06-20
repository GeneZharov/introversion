;( function () { "use strict";


var D = {};

var conf = {
    print: console.log.bind(console),
    format: false,
    enabled: false // If conditional watchers are enabled

};


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


function getKeys(obj) {
    var keys = [];
    for (var i in obj) keys.push(i);
    return keys;
}


function merge(a, b) {
    for (var i in b) { a[i] = b[i]; }
    return a;
}


function normalize(_args) {

    var args = toArray(_args);
    var enabled = args[0].enabled || D.conf.enabled;
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
            this: gets(self, obj)
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
    if (conf.format) {
        if (!quiet) data.push(val);
        conf.print("| V");
        conf.print("----------");
        data.forEach( function (item, i) {
            conf.print("| Data " + i + " |:", item);
        } );
        conf.print(" "); // New line for terminals
    } else {
        if (!quiet) data.push(val);
        conf.print("V:", data);
        conf.print(); // New line for terminals
    }
}


function logFn(error, quiet, data, args, result) {
    if (conf.format) {
        conf.print("| F");
        conf.print("----------");
        data.forEach( function (item, i) {
            conf.print("| Data " + i + " |:", item);
        } );
        if (!quiet) {
            conf.print("-----------");
            args.forEach( function (item, i) {
                conf.print("| Param " + i + " |:", item);
            } );
            conf.print("----------");
            error ? conf.print("| ERROR! |:", result)
                  : conf.print("| Result |:", result);
        }
        conf.print(" "); // New line for terminals
    } else {
        conf.print("F:", data);
        if (!quiet) {
            conf.print("F Params:", args);
            error ? conf.print("F ERROR!:", result)
                  : conf.print("F Result:", result);
        }
        conf.print(); // New line for terminals
    }
}


function v() {
    var a = normalize(arguments);
    if (a.log) logVal(a.quiet, a.data, a.val);
    if (a.deb) debugger;
    return a.val;
}


function p(opt, obj, path) {
    var props = path.split(".").slice(1);
    var val = gets(props, obj);
    return v(opt, path, val);
}


function n(opt, obj) {
    var keys = getKeys(obj);
    var name = keys[0];
    var val = obj[name];
    return v(opt, name, val);
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


function debV(action) {
    D.conf.enabled = true;
    var result = action();
    D.conf.enabled = false;
    return result;
}


function debF(action) {
    return function () {
        D.conf.enabled = true;
        var result = action.apply(this, arguments);
        D.conf.enabled = false;
        return result;
    };
}


D.conf = conf;

D.mb = {};

// Normal mode
D.v     = v.bind(this, {enabled: true});
D.f     = f.bind(this, {enabled: true});
D.m     = f.bind(this, {enabled: true, method: true});
D.p     = p.bind(this, {enabled: true});
D.n     = n.bind(this, {enabled: true});
D.mb.v  = v.bind(this, {});
D.mb.f  = f.bind(this, {});
D.mb.m  = f.bind(this, {method: true});
D.mb.p  = p.bind(this, {});
D.mb.n  = n.bind(this, {});

// Quiet mode
D.V     = v.bind(this, {quiet: true, enabled: true});
D.F     = f.bind(this, {quiet: true, enabled: true});
D.M     = f.bind(this, {quiet: true, enabled: true, method: true});
D.mb.V  = v.bind(this, {quiet: true});
D.mb.F  = f.bind(this, {quiet: true});
D.mb.M  = f.bind(this, {quiet: true, method: true});

// Debugger breakpoints
D.v_    = v.bind(this, {deb: true, enabled: true});
D.f_    = f.bind(this, {deb: true, enabled: true});
D.m_    = f.bind(this, {deb: true, enabled: true, method: true});
D.mb.v_ = v.bind(this, {deb: true});
D.mb.f_ = f.bind(this, {deb: true});
D.mb.m_ = f.bind(this, {deb: true, method: true});

D.debF = debF;
D.debV = debV;


// Obtaining the global object
if (typeof module === "object"
 && typeof module.exports === "object"
) {
    conf.format = true;
    module.exports = D;
} else {
    self.D = D;
}


} () );
