var mongoose = require('mongoose');

var User = null;

//oauthName + oauthType = full name
var UserSchema = new mongoose.Schema({
  name: {
    type: String, //Lemon_iSpring, GitHub_iSpring, WeChat_iSpring
    required: true,
    unique: true
  },
  avatarUrl: {
    type: String,
    required: true
  }
});

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

User = mongoose.model('User', UserSchema);

module.exports = User;