var request = require('request');
var config = require('../config');
var UserModel = require('../models/user');

exports.oauthUrl = `http://github.com/login/oauth/authorize?client_id=${config.oauthClientId}&redirect_uri=${encodeURIComponent(config.oauthRedirectUri)}`;

exports.login = function (req, res, next) {
    var url = `https://github.com/login/oauth/access_token?client_id=${config.oauthClientId}&client_secret=${config.oauthClientSecret}&code=${req.query.code}`;
    request.post({
        uri: url,
        json: true
    }, function (err, response, body) {
        if (err || !response || !body || !body.access_token) {
            return res.json({
                message: `Can't login `
            });
        }
        var userUrl = `https://api.github.com/user?access_token=${body.access_token}`;
        request.get({
            uri: userUrl,
            json: true,
            headers: {
                'User-Agent': 'Node'
            }
        }, function (err, response, body) {
            if (err || !response || !body) {
                return res.json({
                    message: `Can't login `
                });
            }
            UserModel.findOrCreateUser({
                name: body.login,
                avatarUrl: body.avatar_url
            }, function(err, doc){
                if(err){
                    next(err);
                }else{
                    req.session.regenerate(function(err){
                        if(err){
                            return next(err);
                        }
                        req.session.name = doc.name;
                        res.json(doc.toJSON());
                    });
                }
            });
        });
    });
};

exports.logout = function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            return res.json({
                message: "Can't logout"
            });
        }
        res.clearCookie(config.sessionName);
        res.redirect('/');
    });
};