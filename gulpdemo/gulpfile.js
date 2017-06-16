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
        .pipe($.plumber())
        .pipe($.less())
        // .on('error', errorLogger)
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', (done) => {
    let files = config.temp + '**/*.css';
    clean(files, done);
});

gulp.task('less-watcher', () => {
    gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', () => {
    log('Wire up the bower css js into the html');
    let options = config.getWiredepDefaultOptions();
    let wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        // .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], () => {
    log('Wire up css js into the html and call wiredep');
    let injectOptions = {
        ignorePath: ''
    };
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css), injectOptions))
        .pipe(gulp.dest(config.client));
});
/*=============================*/
function errorLogger(error) {
    log('*** Start of error ***');
    log(error);
    log('*** End of error ***');
    this.emit('end');
}

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
