var express = require('express');
var router = express.Router();
var credential = require('./controllers/credential');

router.get('/signup', credential.signupPage);
router.post('/signup/submit', credential.signupSubmit);
router.get('/signin', credential.signinPage);
router.post('/signin/submit', credential.signinSubmit);
router.post('/signout', credential.signout);

module.exports = router;