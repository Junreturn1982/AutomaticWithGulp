const gulp = require('gulp');
const args = require('yargs').argv;
const browserSync = require('browser-sync');
const config = require('./gulp.config')();
const del = require('del');

const $ = require('gulp-load-plugins')({lazy: true});

const port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
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
// listen server
gulp.task('server-dev', ['inject'], () => {
    let isDev = true;
    let nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], (event) => {
            log('*** nodemon restart ***');
            log('files changed on restart: \n' + event);
            setTimeout(function() {
                browserSync.notify('reloading now...');
                browserSync.reload({stream: false});
            }, 1000);
        })
        .on('start', () => {
            log('*** nodemon started ***');
            startBrowserSync();
        })
        .on('crash', () => {
            log('*** nodemon crashed: script crashed for some reason ***');
        })
        .on('exit', () => {
            log('*** nodemon exited cleanly ***');
        });
});
/*=============================*/
function startBrowserSync() {
    if (args.nosync || browserSync.active) {
        return;
    }
    log('Starting browser-sync on port ' + port);
    let options = {
        proxy: 'localhost:' + port,
        port: 4000,
        files: [
            './src/views/' + '*.*', // '**/*.*' 
            './public/**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(options);
}

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
