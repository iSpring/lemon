var mongoose = require('mongoose');
var Reply = require('./reply');

var PostSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['share', 'ask', 'job'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  good: {
    type: Boolean,
    default: false
  },
  top:{
    type: Boolean,
    default: false
  },
  visitCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  }
});

//static methods
PostSchema.statics.addPost = function(options, cb){
  this.create(options, function(err, doc){
    cb(err, doc);
  });
};

PostSchema.statics.getPostById = function(id, cb){
  return this.findById(id, function(err, doc){
    cb(err, doc);
  });
};

PostSchema.statics.getFullPostById = function(id, cb){
  return this.findById(id).populate('user').exec(function(err, doc){
    cb(err, doc);
  });
};


//instance methods
PostSchema.methods.addReply = function(options, cb){
  Reply.addReply(options, (err) => {
    if(err){
      cb(err);
    }else{
      this.replyCount += 1;
      this.save(cb);
    }
  });
};

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;