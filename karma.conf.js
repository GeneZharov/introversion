// Karma configuration
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
        frameworks: ["jasmine"],
        browsers: ["Chrome"],
        files: ["lib/*"]
    });
};
