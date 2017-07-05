var User = require('../models/user');

module.exports = function (router) {
    /**
     * get all users
     */
    router.get('/user/all', function (req, res, next) {
        User.find({}, function (err, docs) {
            if (err) {
                next(err);
            } else {
                docs = docs.map(function (doc) {
                    return doc.toJSON();
                });
                res.json({
                    success: true,
                    users: docs
                });
            }
        });
    });

    /**
     * remove all users
     */
    router.get('/user/all/remove', function (req, res, next) {
        User.remove({}, function (err, count) {
            if (err) {
                next(err);
            } else {
                res.json({
                    success: true
                });
            }
        });
    });

    /**
     * get user detail
     */
    router.get('/user/:name', function (req, res, next) {
        User.findUserByName(req.params.name, function (err, doc) {
            if (err) {
                next(err);
            } else {
                if (doc) {
                    res.json({
                        success: true,
                        user: doc.toJSON()
                    });
                } else {
                    res.json({
                        success: false,
                        message: `Can't find user ${req.params.name}`
                    });
                }
            }
        });
    });

    /**
     * update user info
     * query: {}
     */
    router.get('/user/:name/update', function(req, res, next){
        User.update({
            name: req.params.name
        }, {}, function(err){
            if(err){
                next(err);
            }else{
                res.json({
                    success: true
                });
            }
        });
    });

    /**
     * remove user
     */
    router.get('/user/:name/remove', function (req, res, next) {
        User.remove({
            name: req.params.name
        }, function (err) {
            if (err) {
                next(err);
            } else {
                res.json({
                    success: true
                });
            }
        });
    });
}