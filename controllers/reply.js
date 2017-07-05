var Reply = require('../models/reply');

module.exports = function(router){
    router.get('/reply/all', function(req, res, next){
        Reply.find({}, function(err, docs){
            if(err){
                next(err);
            }else{
                docs = docs.map(function(doc){
                    return doc.toJSON();
                });
                res.json(docs);
            }
        });
    });
};