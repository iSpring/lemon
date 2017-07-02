var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');
var user = require('./controllers/user');

router.get('/', function(req, res, next){
    res.locals.oauthUrl = credential.oauthUrl;
    res.render('index');
});

router.get('/login', credential.login);
router.post('/logout', credential.logout);

router.get('/user/all', user.userall);

module.exports = router;