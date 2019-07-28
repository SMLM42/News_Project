const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const application_controller = require('../controllers/application_controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', application_controller.home)
router.get('/test', application_controller.test);
router.get('/scrape', application_controller.scrape);
router.get('/articles', application_controller.articles)
module.exports = router;