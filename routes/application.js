const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const application_controller = require('../controllers/application_controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', application_controller.home)
router.get('/home', application_controller.home)
router.get('/scrape', application_controller.scrape)
router.get('/articles', application_controller.articles)
router.get('/loadComments/:id', application_controller.loadComments)
router.post('/postComment/:id', application_controller.postComment)
// router.get('')
module.exports = router;