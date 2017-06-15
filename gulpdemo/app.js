const express = require('express');

const app = express();

const port = process.env.PORT || 3000;
const nav = [
                {link: '/Books', text: 'Book'},
                {link: '/Authors', text: 'Author'}
            ];
const bookRouter = require('./src/routes/bookRoutes')(nav);
// router functions
const authorRouter = require('./src/routes/authorRoutes')(nav);

app.listen(port, () => console.log('running server on port ' + port));

app.use(express.static('./public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Authors', authorRouter);

app.get('/', (req, res) => {
    res.render('index', { title: '', nav: [
        {link: '/Books', text: 'Books'},
        {link: '/Authors', text: 'Authors'}
    ]});
});