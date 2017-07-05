var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');
var user = require('./controllers/user');
var post = require('./controllers/post');
var reply = require('./controllers/reply');
var test = require('./controllers/test');

router.get('/', function(req, res, next){
    res.locals.oauthUrl = credential.oauthUrl;
    res.render('index', {
        user: req.session && req.session.user
    });
});

credential(router);
user(router);
post(router);
reply(router);
test(router);

module.exports = router;