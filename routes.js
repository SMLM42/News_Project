module.exports = function (app) {

    const application = require('./routes/application');
    // const search = require('./routes/search');
    const scrape = require('./routes/scrape');
    const comment = require('./routes/comment.js');
    // const users = require('./routes/users');


    app.use('/', application);
    // app.use('/search', search);
    // app.use('/scrape', scrape);
    // app.use('/comment', comment);
    // app.use('/users', users);
}