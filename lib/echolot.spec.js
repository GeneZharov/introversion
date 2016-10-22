'use strict';


const E = echolot;
E.conf.format = false;


let result;

const name = 9;
const fn = x => x.name;

const obj = {
    prop: 1,
    fn(n) { return this.prop + n; }
};
const ns = {a: {b: {c: obj}}};


beforeEach(() => spyOn(E.conf, "print"));


describe("In the normal mode", () => {

    describe("value's watch", () => {
        it("should not log anything with E.mb.v()", () => {
            result = E.mb.v(1, 2, name);
            expect(result).toBe(name);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledWith("V:", [1, 2, name]);
            });
            it("should log with E.v()", () => {
                result = E.v(1, 2, name);
            });
            it("should log with E.debV() and E.mb.v()", () => {
                result = E.debV(() => E.mb.v(1, 2, name));
            });
            it("should log with E.debF() and E.mb.v()", () => {
                const action = () => E.mb.v(1, 2, name);
                result = E.debF(action)();
            });
        });
    });

    describe("function's watch", () => {
        it("should not log anything with E.mb.f()", () => {
            result = E.mb.f(1, 2, fn)({name});
            expect(result).toBe(name);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledTimes(3);
                expect(E.conf.print).toHaveBeenCalledWith('F:', [1, 2]);
                expect(E.conf.print).toHaveBeenCalledWith('F Params:', [{name}]);
                expect(E.conf.print).toHaveBeenCalledWith('F Result:', 9);
            });
            it("should log with E.f()", () => {
                result = E.f(1, 2, fn)({name});
            });
            it("should log with E.debV() and E.mb.f()", () => {
                const action = E.mb.f(1, 2, fn);
                result = E.debV(() => action({name}));
            });
            it("should log with E.debF() and E.mb.f()", () => {
                const action = E.mb.f(1, 2, fn);
                result = E.debF(action)({name});
            });
        });
    });

    describe("methods's watch", () => {
        it("should not log anything with E.mb.m()", () => {
            result = E.mb.m(1, 2, ns, ".a.b.c.fn")(8);
            expect(result).toBe(9);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledTimes(3);
                expect(E.conf.print).toHaveBeenCalledWith('F:', [1, 2]);
                expect(E.conf.print).toHaveBeenCalledWith('F Params:', [8]);
                expect(E.conf.print).toHaveBeenCalledWith('F Result:', 9);
            });
            it("should log with E.m() and a short path", () => {
                result = E.m(1, 2, ns.a.b.c, ".fn")(8);
            });
            it("should log with E.m() and a full path", () => {
                result = E.m(1, 2, ns, ".a.b.c.fn")(8);
            });
            it("should log with E.debV() and E.mb.m()", () => {
                const action = E.mb.m(1, 2, ns, ".a.b.c.fn");
                result = E.debV(() => action(8));
            });
            it("should log with E.debF() and E.mb.m()", () => {
                const action = E.mb.m(1, 2, ns, ".a.b.c.fn");
                result = E.debF(action)(8);
            });
        });
    });

});


describe("In the breakpoint mode", () => {

    afterEach(() => {
        expect(result).toBe(name);
        expect(E.conf.print).not.toHaveBeenCalled();
    });

    it("should not log with E.f_()", () => {
        result = E.f_(1, 2, fn)({name});
    });
    it("should not log with E.mb.f_()", () => {
        result = E.mb.f_(1, 2, fn)({name});
    });
    it("should not log with E.m_()", () => {
        result = E.m_(1, 2, ns, ".a.b.c.fn")(8);
    });
    it("should not log with E.mb.m_()", () => {
        result = E.mb.m_(1, 2, ns, ".a.b.c.fn")(8);
    });
    it("should not log with E.v_()", () => {
        result = E.v_(name);
    });
    it("should not log with E.mb.v_()", () => {
        result = E.mb.v_(1, 2, name);
    });
    it("should not log with E.debV() and E.mb.v_()", () => {
        result = E.debV(() => E.mb.v_(1, 2, name));
    });
    it("should not log with E.debV() and E.mb.f_()", () => {
        result = E.debV(() => E.mb.f_(1, 2, fn)({name}));
    });

});


describe("In the quiet mode", () => {

    describe("value's watch", () => {
        it("should not log anything with E.mb.V()", () => {
            result = E.mb.V(1, 2, name);
            expect(result).toBe(name);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledWith("V:", [1, 2]);
            });
            it("should log with E.V()", () => {
                result = E.V(1, 2, name);
            });
            it("should log with E.debV() and E.mb.V()", () => {
                result = E.debV(() => E.mb.V(1, 2, name));
            });
        });
    });

    describe("function's watch", () => {
        it("should not log anything with E.mb.F()", () => {
            result = E.mb.F(1, 2, fn)({name});
            expect(result).toBe(name);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledTimes(1);
                expect(E.conf.print).toHaveBeenCalledWith("F:", [1, 2]);
            });
            it("should log with E.F()", () => {
                result = E.F(1, 2, fn)({name});
            });
            it("should log with E.debF() and E.mb.F()", () => {
                const action = E.mb.F(1, 2, fn);
                result = E.debF(action)({name});
            });
        });
    });

    describe("methods's watch", () => {
        it("should not log anything with E.mb.M()", () => {
            result = E.mb.M(1, 2, ns, ".a.b.c.fn")(8);
            expect(result).toBe(9);
            expect(E.conf.print).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(E.conf.print).toHaveBeenCalledTimes(1);
                expect(E.conf.print).toHaveBeenCalledWith("F:", [1, 2]);
            });
            it("should log with E.M()", () => {
                result = E.M(1, 2, ns, ".a.b.c.fn")(8);
            });
            it("should log with E.debF() and E.mb.M()", () => {
                const action = E.mb.M(1, 2, ns, ".a.b.c.fn");
                result = E.debF(action)(8);
            });
        });
    });

});
