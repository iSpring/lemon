var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.mongodb, function(err){
  if(err){
    return console.error(`Can't connect to mongodb ${config.db}`, err);
  }
  require('./User');
  require('./Post');
});