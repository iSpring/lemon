var Post = require('../models/post');
var Auth = require('../middlewares/auth');

module.exports = function(router){
    /**
     * add new post
     * query: {title,content}
     */
    router.get('/post/new', Auth.userRequired, function(req, res, next){
        Post.addPost({
            userId: req.session.user._id,
            title: req.query.title,
            content: req.query.content
        }, function(err, doc){
            if(err){
                next(err);
            }else{
                res.json({
                    success: true,
                    post: doc.toJSON()
                });
            }
        });
    });

    /**
     * show all posts
     */
    router.get('/post/all', function(req, res, next){
        Post.find(function(err, docs){
            if(err){
                next(err);
            }else{
                docs = docs.map(function(doc){
                    return doc.toJSON();
                });
                res.json({
                    success: true,
                    posts: docs
                });
            }
        });
    });

    /**
     * remove all posts
     */
    router.get('/post/all/remove', function(req, res, next){
        Post.remove({}, function(err){
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
     * show post detail
     */
    router.get('/post/:id', function(req, res, next){
        Post.findById(req.params.id, function(err, doc){
            if(err){
                next(err);
            }else{
                res.json({
                    success: true,
                    post: doc.toJSON()
                });
            }
        });
    });

    /**
     * update post
     * query: {title, content}
     */
    router.get('/post/:id/update', function(req, res, next){
        var update = {};
        if(req.query.title){
            update.title = req.query.title;
        }
        if(req.query.content){
            update.content = req.query.content;
        }
        Post.findByIdAndUpdate(req.params.id, update, function(err, doc){
            if(err){
                next(err);
            }else{
                res.json({
                    success: true,
                    post: doc.toJSON()
                });
            }
        });
    });

    /**
     * remove post
     */
    router.get('/post/:id/remove', function(req, res, next){
        Post.findByIdAndRemove(req.params.id, function(err){
            if(err){
                next(err);
            }else{
                res.json({
                    success: true
                });
            }
        });
    });
};