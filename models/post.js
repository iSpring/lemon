var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['share', 'ask', 'job']
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  good: {
    type: Boolean,
    default: false
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