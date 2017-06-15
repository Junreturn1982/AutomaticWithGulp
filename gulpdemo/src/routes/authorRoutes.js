const express = require('express');
const books = require('../../data/books');

const authorRouter = express.Router();

const router = (val) => {
    authorRouter.route('/')
    .get((req, res) => {
        res.render('bookListView', { title: 'Books', nav: val, books });
    });
    return authorRouter;
};

module.exports = router;