var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;