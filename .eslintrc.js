const globals = {
    jasmine: {
        jasmine: false,
        describe: false,
        xdescribe: false,
        it: false,
        xit: false,
        beforeAll: false,
        afterAll: false,
        beforeEach: false,
        afterEach: false,
        expect: false,
        spyOn: false
    }
};


module.exports = {
    env: {browser: true, node: true},
    parserOptions: {ecmaVersion: 6},
    globals: Object.assign({D: true}, globals.jasmine),
    rules: {
        "semi": 2,
        "comma-dangle": 2,
        "no-cond-assign": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-empty-character-class": 2,
        "no-func-assign": 2,
        "no-invalid-regexp": 2,
        "use-isnan": 2,
        "valid-typeof": 2,
        "no-fallthrough": 2,
        "no-octal": 2,
        "no-delete-var": 2,
        "no-undef": 2,
        "no-mixed-spaces-and-tabs": 2,
        "no-irregular-whitespace": 0,
        "eqeqeq": 2
    }
};
