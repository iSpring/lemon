var user = require('../models/user');

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