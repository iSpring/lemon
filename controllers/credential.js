var request = require('request');
var config = require('../config');
var UserModel = require('../models/user');

module.exports = function (router) {
    router.get('/login', function (req, res, next) {
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
                    name: `GitHub_${body.login}`,
                    avatarUrl: body.avatar_url,
                    displayName: body.login
                }, function (err, doc) {
                    if (err) {
                        next(err);
                    } else {
                        req.session.regenerate(function (err) {
                            if (err) {
                                return next(err);
                            }
                            req.session.user = {
                                _id: doc._id,
                                name: doc.name,
                                avatarUrl: doc.avatarUrl,
                                displayName: doc.displayName,
                                isAdmin: doc.isAdmin
                            };
                            res.json(doc.toJSON());
                        });
                    }
                });
            });
        });
    });

    router.get('/logout', function (req, res, next) {
        req.session.destroy(function (err) {
            if (err) {
                return res.json({
                    message: "Can't logout"
                });
            }
            res.clearCookie(config.sessionName);
            res.redirect('/');
        });
    });
};

module.exports.oauthUrl = `http://github.com/login/oauth/authorize?client_id=${config.oauthClientId}&redirect_uri=${encodeURIComponent(config.oauthRedirectUri)}`;