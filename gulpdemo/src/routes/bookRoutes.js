const express = require('express');
const books = require('../../data/books');

const bookRouter = express.Router();

const router = (nav) => {
    bookRouter.route('/')
    .get((req, res) => {
        res.render('bookListView', {title: 'Books', nav, books});
    });

    bookRouter.route('/:id')
        .get((req, res) => {
            let { id } = req.params;
            res.render('bookView', {title: 'Books', nav, book: books[id]});
        });
        return bookRouter;
    };


module.exports = router;
