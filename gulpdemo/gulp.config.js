module.exports = function () {
    let client = './src/client/';
    let clientView = './src/views/';
    let temp = './.tmp/';
    let server = './';

    let config = {
        temp: temp,
        server,
        /**
         * Files path
         */
        // all js to vet
        alljs: [
                './src/**/*.js',
                './*.js'
            ],
        build: './build/',
        fonts: './public/lib/font-awesome/fonts/**/*.*',
        less: client + 'styles/styles.less',
        //
        client: './src/views',
        index: clientView + '*.ejs',
        js: [
            './public/lib/**/*.js',
        ],
        css: temp + 'styles.css',
        /**
         * Bower and npm location 
         */
        bower: {
            json: require('./bower.json'),
            directory: './public/lib',
            ignorePath: '../../public'
        },
        /**
         * Node settings
         */
        defaultPort: 3000,
        nodeServer: './app.js'
    };

    config.getWiredepDefaultOptions = () => {
        let options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
