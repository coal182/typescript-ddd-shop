const gulp = require('gulp'),
    run = require('gulp-run-command').default;
gulp.task('unit-tests-watch-ts',gulp.series('devel-build', async function runTests() {
    return run('ng test --karmaConfig=tests/karma-ts.conf.js', angularEnvOptions)();
}));