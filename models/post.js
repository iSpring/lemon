var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

//static methods
PostSchema.statics.addPost = function(options, cb){
  this.create(options, function(err, doc){
    cb(err, doc);
  });
};

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;