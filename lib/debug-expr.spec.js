'use strict';


let result;

const name = 9;
const fn = x => x.name;

const obj = {
    prop: 1,
    fn(n) { return this.prop + n; }
};
const ns = {a: {b: {c: obj}}};

D.conf.format = false;


beforeEach(() => spyOn(D.conf, "print"));


describe("In normal mode", () => {

    describe("value's watch", () => {
        it("should not log anything with D.mb.v()", () => {
            result = D.mb.v(1, 2, name);
            expect(result).toBe(name);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledWith("V:", [1, 2, name]);
            });
            it("should log with D.v()", () => {
                result = D.v(1, 2, name);
            });
            it("should log with D.debV() and D.mb.v()", () => {
                result = D.debV(() => D.mb.v(1, 2, name));
            });
            it("should log with D.debF() and D.mb.v()", () => {
                const action = () => D.mb.v(1, 2, name);
                result = D.debF(action)();
            });
        });
    });

    describe("function's watch", () => {
        it("should not log anything with D.mb.f()", () => {
            result = D.mb.f(1, 2, fn)({name});
            expect(result).toBe(name);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledTimes(4);
                expect(D.conf.print).toHaveBeenCalledWith('F:', [1, 2]);
                expect(D.conf.print).toHaveBeenCalledWith('F Params:', [{name}]);
                expect(D.conf.print).toHaveBeenCalledWith('F Result:', 9);
            });
            it("should log with D.f()", () => {
                result = D.f(1, 2, fn)({name});
            });
            it("should log with D.debV() and D.mb.f()", () => {
                const action = D.mb.f(1, 2, fn);
                result = D.debV(() => action({name}));
            });
            it("should log with D.debF() and D.mb.f()", () => {
                const action = D.mb.f(1, 2, fn);
                result = D.debF(action)({name});
            });
        });
    });

    describe("methods's watch", () => {
        it("should not log anything with D.mb.m()", () => {
            result = D.mb.m(1, 2, ns, ".a.b.c.fn")(8);
            expect(result).toBe(9);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledTimes(4);
                expect(D.conf.print).toHaveBeenCalledWith('F:', [1, 2]);
                expect(D.conf.print).toHaveBeenCalledWith('F Params:', [8]);
                expect(D.conf.print).toHaveBeenCalledWith('F Result:', 9);
            });
            it("should log with D.m()", () => {
                result = D.m(1, 2, ns, ".a.b.c.fn")(8);
            });
            it("should log with D.debV() and D.mb.m()", () => {
                const action = D.mb.m(1, 2, ns, ".a.b.c.fn");
                result = D.debV(() => action(8));
            });
            it("should log with D.debF() and D.mb.m()", () => {
                const action = D.mb.m(1, 2, ns, ".a.b.c.fn");
                result = D.debF(action)(8);
            });
        });
    });

    describe("name's watch", () => {
        it("should not log anything with D.mb.n()", () => {
            result = D.mb.n({name});
            expect(D.conf.print).not.toHaveBeenCalled();
            expect(result).toBe(name);
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(D.conf.print).toHaveBeenCalledWith("V:", ["name", name]);
                expect(result).toBe(name);
            });
            it("should log with D.n()", () => {
                result = D.n({name});
            });
            it("should log with D.debV() and D.mb.n()", () => {
                result = D.debV(() => D.mb.n({name}));
            });
            it("should log with D.debF() and D.mb.n()", () => {
                const action = () => D.mb.n({name});
                result = D.debF(action)();
            });
        });
    });

    describe("prop's watch", () => {
        afterEach(() => {
            expect(result).toBe(ns.a.b.c);
        });
        it("should log a property with D.p()", () => {
            result = D.p(ns.a.b, ".c");
            expect(D.conf.print)
                .toHaveBeenCalledWith("V:", [".c", ns.a.b.c]);
        });
        it("should log a short path with D.p()", () => {
            result = D.p(ns, ".a.b.c");
            expect(D.conf.print)
                .toHaveBeenCalledWith("V:", [".a.b.c", ns.a.b.c]);
        });
        it("should log a full path with D.p()", () => {
            result = D.p(ns, "ns.a.b.c");
            expect(D.conf.print)
                .toHaveBeenCalledWith("V:", ["ns.a.b.c", ns.a.b.c]);
        });
        it("should log with D.debV() and D.mb.p()", () => {
            result = D.debV(() => D.mb.p(ns, ".a.b.c"));
            expect(D.conf.print)
                .toHaveBeenCalledWith("V:", [".a.b.c", ns.a.b.c]);
        });
        it("should log with D.debF() and D.mb.p()", () => {
            const action = () => D.mb.p(ns, ".a.b.c");
            result = D.debF(action)();
            expect(D.conf.print)
                .toHaveBeenCalledWith("V:", [".a.b.c", ns.a.b.c]);
        });
        it("should not log anything with D.mb.p()", () => {
            result = D.mb.p(ns, ".a.b.c");
            expect(D.conf.print)
                .not.toHaveBeenCalled();
        });
    });

});


describe("In debugger mode", () => {

    afterEach(() => {
        expect(result).toBe(name);
        expect(D.conf.print).not.toHaveBeenCalled();
    });

    it("should not log with D.f_()", () => {
        result = D.f_(1, 2, fn)({name});
    });
    it("should not log with D.mb.f_()", () => {
        result = D.mb.f_(1, 2, fn)({name});
    });
    it("should not log with D.m_()", () => {
        result = D.m_(1, 2, ns, ".a.b.c.fn")(8);
    });
    it("should not log with D.mb.m_()", () => {
        result = D.mb.m_(1, 2, ns, ".a.b.c.fn")(8);
    });
    it("should not log with D.v_()", () => {
        result = D.v_(name);
    });
    it("should not log with D.mb.v_()", () => {
        result = D.mb.v_(1, 2, name);
    });
    it("should not log with D.debV() and D.mb.v_()", () => {
        result = D.debV(() => D.mb.v_(1, 2, name));
    });
    it("should not log with D.debV() and D.mb.f_()", () => {
        result = D.debV(() => D.mb.f_(1, 2, fn)({name}));
    });

});


describe("In quiet mode", () => {

    describe("value's watch", () => {
        it("should not log anything with D.mb.V()", () => {
            result = D.mb.V(1, 2, name);
            expect(result).toBe(name);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledWith("V:", [1, 2]);
            });
            it("should log with D.V()", () => {
                result = D.V(1, 2, name);
            });
            it("should log with D.debV() and D.mb.V()", () => {
                result = D.debV(() => D.mb.V(1, 2, name));
            });
        });
    });

    describe("function's watch", () => {
        it("should not log anything with D.mb.F()", () => {
            result = D.mb.F(1, 2, fn)({name});
            expect(result).toBe(name);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledTimes(2);
                expect(D.conf.print).toHaveBeenCalledWith("F:", [1, 2]);
            });
            it("should log with D.F()", () => {
                result = D.F(1, 2, fn)({name});
            });
            it("should log with D.debF() and D.mb.F()", () => {
                const action = D.mb.F(1, 2, fn);
                result = D.debF(action)({name});
            });
        });
    });

    describe("methods's watch", () => {
        it("should not log anything with D.mb.M()", () => {
            result = D.mb.M(1, 2, ns, ".a.b.c.fn")(8);
            expect(result).toBe(9);
            expect(D.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(D.conf.print).toHaveBeenCalledTimes(2);
                expect(D.conf.print).toHaveBeenCalledWith("F:", [1, 2]);
            });
            it("should log with D.M()", () => {
                result = D.M(1, 2, ns, ".a.b.c.fn")(8);
            });
            it("should log with D.debF() and D.mb.M()", () => {
                const action = D.mb.M(1, 2, ns, ".a.b.c.fn");
                result = D.debF(action)(8);
            });
        });
    });

});
