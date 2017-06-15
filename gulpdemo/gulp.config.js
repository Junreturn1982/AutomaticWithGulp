module.exports = function () {
    let client = './src/client/';
    let config = {
        temp: './.tmp',
        /**
         * Files path
         */
        // all js to vet
        alljs: [
                './src/**/*.js',
                './*.js'
            ],
        less: client + 'styles/styles.less'
    };
    return config;
};
