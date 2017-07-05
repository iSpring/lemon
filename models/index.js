var mongoose = require('mongoose');
var config = require('../config');
//http://mongoosejs.com/docs/plugins.html
mongoose.plugin(require('./plugin'));
require('./user');
require('./post');
require('./reply');

mongoose.connect(config.mongodb, function(err){
  if(err){
    return console.error(`Can't connect to mongodb ${config.mongodb}`, err);
  }
  console.log(`Connect to mongodb ${config.mongodb}`);
});