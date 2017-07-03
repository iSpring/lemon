var user = require('../models/user');

//all users
exports.userall = function(req, res, next){
    user.find({}, function(err, docs){
        if(err){
            next(err);
        }else{
            docs = docs.map(function(doc){
                return doc.toJSON();
            });
            res.json(docs);
        }
    });
};

//user detail
exports.userdetail = function(req, res, next){
    user.findUserByName(req.params.name, function(err, doc){
        if(err){
            next(err);
        }else{
            if(doc){
                res.json(doc.toJSON());
            }else{
                res.json({
                    message: `Can't find user ${req.params.name}`
                });
            }            
        }
    });
};

//remove all users
exports.userremoveall = function(req, res, next){
    user.remove({}, function(err, count){
        if(err){
            next(err);
        }else{
            res.json({
                message: `Remove all users`
            });
        }
    });
};

//remove user
exports.userremove = function(req, res, next){
    user.remove({
        name: req.params.name
    }, function(err){
        if(err){
            next(err);
        }else{
            res.json({
                message: `Remove user ${req.params.name}`
            });
        }
    })
};