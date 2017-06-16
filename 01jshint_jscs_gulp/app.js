const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('running server on port ' + port));

app.use(express.static('./public'));
app.use(express.static('./src/views'));
// http://localhost:3000/index.html