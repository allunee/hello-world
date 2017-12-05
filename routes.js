var express = require('express');
var router = express.Router();
var apicontroller = require('./controllers/api.js');
// Other controllers...

router.get('/api', apicontroller.index);
// Other route definitions...

module.exports = router;