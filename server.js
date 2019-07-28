const express = require('express');
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const axios = require("axios")

app.set('views', path.join(__dirname, 'views'));

const exphbs = require('express-handlebars');

mongoose.connect("mongodb://localhost/newsProject", { useNewUrlParser: true })
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    })
});

const port = 1353;
app.listen(port, function () {
    console.log("listening on port" + port)
})

module.exports = app;
module.exports = axios