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
        it("should not log with D.V()", () => {
            result = D.V(1, 2, prop);
        });
        it("should not log with D.F()", () => {
            result = D.F(1, 2, fn)({prop});
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
        it("should log data with D.onV() and D.V()", () => {
            result = D.onV(() => D.V(1, 2, prop));
        });
        it("should log data with D.onF() and D.V()", () => {
            const action = () => D.V(1, 2, prop);
            result = D.onF(action)();
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
        it("should log data with D.onV() and D.F()", () => {
            const action = D.F(1, 2, fn);
            result = D.onV(() => action({prop}));
        });
        it("should log data with D.onF() and D.F()", () => {
            const action = D.F(1, 2, fn);
            result = D.onF(action)({prop});
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

    it("should not log with D.f.deb()", () => {
        result = D.f.deb(fn)({prop});
    });
    it("should not log with D.F.deb()", () => {
        result = D.F.deb(fn)({prop});
    });
    it("should not log with D.v.deb()", () => {
        result = D.v.deb(prop);
    });
    it("should not log with D.V.deb()", () => {
        result = D.V.deb(prop);
    });
    it("should not log with D.onV() and D.V.deb()", () => {
        result = D.onV(() => D.V.deb(prop));
    });
    it("should not log with D.onV() and D.F.deb()", () => {
        result = D.onV(() => D.f.deb(fn)({prop}));
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
        it("should not log with D.V.q()", () => {
            result = D.V.q(1, 2, prop);
        });
        it("should not log with D.F.q()", () => {
            result = D.F.q(1, 2, fn)({prop});
        });
    });

    describe("value's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledWith("V:", 1, 2);
        });
        it("should log data with D.v.q()", () => {
            result = D.v.q(1, 2, prop);
        });
        it("should log data with D.onV() and D.V.q()", () => {
            result = D.onV(() => D.V.q(1, 2, prop));
        });
    });

    describe("function's watch", () => {
        afterEach(() => {
            expect(result).toBe(prop);
            expect(console.log).toHaveBeenCalledTimes(2);
            expect(console.log).toHaveBeenCalledWith("F:", 1, 2);
        });
        it("should log data with D.f.q()", () => {
            result = D.f.q(1, 2, fn)({prop});
        });
        it("should log data with D.onF() and D.F.q()", () => {
            const action = D.F.q(1, 2, fn);
            result = D.onF(action)({prop});
        });
    });

});
