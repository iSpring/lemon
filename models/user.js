var mongoose = require('mongoose');
var Post = require('./post');

var UserSchema = new mongoose.Schema({
  name: {
    type: String, //Lemon_iSpring, GitHub_iSpring, WeChat_iSpring
    required: true,
    unique: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  score: {
    type: Number,
    required: false,
    default: 0
  },
  signature: {
    type: String,
    required: false,
    default: ''
  }
});

//static methods
UserSchema.statics.addUser = function (options, cb) {
  this.create(options, function (err, doc) {
    cb(err, doc);
  });
};

UserSchema.statics.findUserByName = function (name, cb) {
  this.findOne({
    name: name
  }, function (err, doc) {
    cb(err, doc);   
  });
};

UserSchema.statics.findOrCreateUser = function (options, cb) {
  this.findUserByName(options.name, (err, doc) => {
    if (err) {
      cb(err);
    } else {
      if (doc) {
        cb(null, doc);
      } else {
        this.addUser(options, function(err2, doc2){
          cb(err2, doc2);
        });
      }
    }
  })
};

//instance methods
UserSchema.methods.addPost = function(options, cb){
  options.userId = this._id;
  Post.addPost(options, function(err, doc){
    cb(err, doc);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;