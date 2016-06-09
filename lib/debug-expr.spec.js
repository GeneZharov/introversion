beforeEach(() => spyOn(console, "log"));


describe("In normal mode", () => {

    let result;
    const prop = 9;
    const fn = x => x.prop;

    describe("conditional watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).not.toHaveBeenCalled();
        });
        it("should not log with D.mb.v()", () => {
            result = D.mb.v(1, 2, prop);
        });
        it("should not log with D.mb.f()", () => {
            result = D.mb.f(1, 2, fn)({prop});
        });
    });

    describe("value's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledWith("V:", 1, 2, prop);
        });
        it("should log data with D.v()", () => {
            result = D.v(1, 2, prop);
        });
        it("should log data with D.debV() and D.mb.v()", () => {
            result = D.debV(() => D.mb.v(1, 2, prop));
        });
        it("should log data with D.debF() and D.mb.v()", () => {
            const action = () => D.mb.v(1, 2, prop);
            result = D.debF(action)();
        });
    });

    describe("function's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledTimes(4);
            expect(console.log).toHaveBeenCalledWith('F:', 1, 2);
            expect(console.log).toHaveBeenCalledWith('F Params:', [{prop}]);
            expect(console.log).toHaveBeenCalledWith('F Result:', 9);
        });
        it("should log data with D.f()", () => {
            result = D.f(1, 2, fn)({prop});
        });
        it("should log data with D.debV() and D.mb.f()", () => {
            const action = D.mb.f(1, 2, fn);
            result = D.debV(() => action({prop}));
        });
        it("should log data with D.debF() and D.mb.f()", () => {
            const action = D.mb.f(1, 2, fn);
            result = D.debF(action)({prop});
        });
    });

});


describe("In debugger mode", () => {

    let result;
    const prop = 9;
    const fn = x => x.prop;

    afterEach(() => {
        expect(result).toBe(prop);
        expect(console.log).not.toHaveBeenCalled();
    });

    it("should not log with D.f_()", () => {
        result = D.f_(fn)({prop});
    });
    it("should not log with D.mb.f_()", () => {
        result = D.mb.f_(fn)({prop});
    });
    it("should not log with D.v_()", () => {
        result = D.v_(prop);
    });
    it("should not log with D.mb.v_()", () => {
        result = D.mb.v_(prop);
    });
    it("should not log with D.debV() and D.mb.v_()", () => {
        result = D.debV(() => D.mb.v_(prop));
    });
    it("should not log with D.debV() and D.mb.f_()", () => {
        result = D.debV(() => D.mb.f_(fn)({prop}));
    });

});


describe("In quiet mode", () => {

    let result;
    const prop = 9;
    const fn = x => x.prop;

    describe("conditional watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).not.toHaveBeenCalled();
        });
        it("should not log with D.mb.V()", () => {
            result = D.mb.V(1, 2, prop);
        });
        it("should not log with D.mb.F()", () => {
            result = D.mb.F(1, 2, fn)({prop});
        });
    });

    describe("value's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledWith("V:", 1, 2);
        });
        it("should log data with D.V()", () => {
            result = D.V(1, 2, prop);
        });
        it("should log data with D.debV() and D.mb.V()", () => {
            result = D.debV(() => D.mb.V(1, 2, prop));
        });
    });

    describe("function's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledTimes(2);
            expect(console.log).toHaveBeenCalledWith("F:", 1, 2);
        });
        it("should log data with D.F()", () => {
            result = D.F(1, 2, fn)({prop});
        });
        it("should log data with D.debF() and D.mb.F()", () => {
            const action = D.mb.F(1, 2, fn);
            result = D.debF(action)({prop});
        });
    });

});
