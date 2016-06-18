'use strict';


beforeEach(() => spyOn(console, "log"));


describe("In normal mode", () => {

    let result;
    const name = 9;
    const fn = x => x.name;
    const obj = {a: {b: {c: 8}}};

    describe("value's watch", () => {
        it("should not log anything with D.mb.v()", () => {
            result = D.mb.v(1, 2, name);
            expect(result).toBe(name);
            expect(console.log).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(console.log).toHaveBeenCalledWith("V:", [1, 2, name]);
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
            expect(console.log).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(console.log).toHaveBeenCalledTimes(4);
                expect(console.log).toHaveBeenCalledWith('F:', [1, 2]);
                expect(console.log).toHaveBeenCalledWith('F Params:', [{name}]);
                expect(console.log).toHaveBeenCalledWith('F Result:', 9);
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

    describe("name's watch", () => {
        it("should not log anything with D.mb.n()", () => {
            result = D.mb.n({name});
            expect(console.log).not.toHaveBeenCalled();
            expect(result).toBe(name);
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(console.log).toHaveBeenCalledWith("V:", ["name", name]);
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
            expect(result).toBe(obj.a.b.c);
        });
        it("should log a property with D.p()", () => {
            result = D.p(obj.a.b, ".c");
            expect(console.log)
                .toHaveBeenCalledWith("V:", [".c", obj.a.b.c]);
        });
        it("should log a short path with D.p()", () => {
            result = D.p(obj, ".a.b.c");
            expect(console.log)
                .toHaveBeenCalledWith("V:", [".a.b.c", obj.a.b.c]);
        });
        it("should log a full path with D.p()", () => {
            result = D.p(obj, "obj.a.b.c");
            expect(console.log)
                .toHaveBeenCalledWith("V:", ["obj.a.b.c", obj.a.b.c]);
        });
        it("should log with D.debV() and D.mb.p()", () => {
            result = D.debV(() => D.mb.p(obj, ".a.b.c"));
            expect(console.log)
                .toHaveBeenCalledWith("V:", [".a.b.c", obj.a.b.c]);
        });
        it("should log with D.debF() and D.mb.p()", () => {
            const action = () => D.mb.p(obj, ".a.b.c");
            result = D.debF(action)();
            expect(console.log)
                .toHaveBeenCalledWith("V:", [".a.b.c", obj.a.b.c]);
        });
        it("should not log anything with D.mb.p()", () => {
            result = D.mb.p(obj, ".a.b.c");
            expect(console.log)
                .not.toHaveBeenCalled();
        });
    });

});


describe("In debugger mode", () => {

    let result;
    const name = 9;
    const fn = x => x.name;

    afterEach(() => {
        expect(result).toBe(name);
        expect(console.log).not.toHaveBeenCalled();
    });

    it("should not log with D.f_()", () => {
        result = D.f_(fn)({name});
    });
    it("should not log with D.mb.f_()", () => {
        result = D.mb.f_(fn)({name});
    });
    it("should not log with D.v_()", () => {
        result = D.v_(name);
    });
    it("should not log with D.mb.v_()", () => {
        result = D.mb.v_(name);
    });
    it("should not log with D.debV() and D.mb.v_()", () => {
        result = D.debV(() => D.mb.v_(name));
    });
    it("should not log with D.debV() and D.mb.f_()", () => {
        result = D.debV(() => D.mb.f_(fn)({name}));
    });

});


describe("In quiet mode", () => {

    let result;
    const name = 9;
    const fn = x => x.name;

    describe("value's watch", () => {
        it("should not log anything with D.mb.V()", () => {
            result = D.mb.V(1, 2, name);
            expect(result).toBe(name);
            expect(console.log).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(console.log).toHaveBeenCalledWith("V:", [1, 2]);
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
            expect(console.log).not.toHaveBeenCalled();
        });
        describe("when enabled", () => {
            afterEach(() => {
                expect(result).toBe(name);
                expect(console.log).toHaveBeenCalledTimes(2);
                expect(console.log).toHaveBeenCalledWith("F:", [1, 2]);
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

});
