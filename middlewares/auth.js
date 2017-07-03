exports.userRequired = function(req, res, next){
    if(!req.session || !req.session.user || !req.session._id){
        return res.status(403).send('forbidden');
    }
    next();
};