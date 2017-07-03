var User = require('../models/user');

module.exports = function (router) {
    //all users
    router.get('/user/all', function (req, res, next) {
        User.find({}, function (err, docs) {
            if (err) {
                next(err);
            } else {
                docs = docs.map(function (doc) {
                    return doc.toJSON();
                });
                res.json(docs);
            }
        });
    });

    //user detail
    router.get('/user/:name', function (req, res, next) {
        User.findUserByName(req.params.name, function (err, doc) {
            if (err) {
                next(err);
            } else {
                if (doc) {
                    res.json(doc.toJSON());
                } else {
                    res.json({
                        message: `Can't find user ${req.params.name}`
                    });
                }
            }
        });
    });

    //remove all users
    router.get('/user/remove/all', function (req, res, next) {
        User.remove({}, function (err, count) {
            if (err) {
                next(err);
            } else {
                res.json({
                    message: `Remove all users`
                });
            }
        });
    });

    //remove user
    router.get('/user/remove/:name', function (req, res, next) {
        User.remove({
            name: req.params.name
        }, function (err) {
            if (err) {
                next(err);
            } else {
                res.json({
                    message: `Remove user ${req.params.name}`
                });
            }
        })
    });

    //add post
    router.get('/user/addpost', function (req, res, next) {
        User.addPost({
            title: req.query.title,
            content: req.query.content,
            userId: req.session.userId
        }, function (err, doc) {
            if (err) {
                next(err);
            } else {
                res.json({
                    message: 'Add new post',
                    post: doc.toJSON()
                });
            }
        })
    });
}