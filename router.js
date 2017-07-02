var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');

router.get('/', function(req, res, next){
    res.locals.oauthUrl = credential.oauthUrl;
    res.render('index');
});

router.get('/login', credential.login);
router.post('/logout', credential.logout);

module.exports = router;