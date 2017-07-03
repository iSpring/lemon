var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');
var user = require('./controllers/user');

router.get('/', function(req, res, next){
    res.locals.oauthUrl = credential.oauthUrl;
    res.render('index');
});

credential(router);
user(router);

module.exports = router;