var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');
var user = require('./controllers/user');

router.get('/', function(req, res, next){
    res.locals.oauthUrl = credential.oauthUrl;
    res.render('index');
});

//credential
router.get('/login', credential.login);
router.post('/logout', credential.logout);

//user
router.get('/user/all', user.userall);
router.get('/user/:name', user.userdetail);
router.get('/user/remove/all', user.userremoveall);
router.get('/user/remove/:name', user.userremove);

module.exports = router;