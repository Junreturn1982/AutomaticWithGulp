const gulp = require('gulp');
const args = require('yargs').argv;
const config = require('./gulp.config')();
const del = require('del');

const $ = require('gulp-load-plugins')({lazy: true});

// gulp vet
gulp.task('vet', () => {
    log('Analyzing source with JSHint and JSCS');
    return gulp
            .src(config.alljs)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'],() => {
    log('Compiling Less --> css');

    return gulp
        .src(config.less)
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', (done) => {
    let files = config.temp + '**/*.css';
    clean(files, done);
});
/*=============================*/
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path);
    done(undefined);
}
function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
