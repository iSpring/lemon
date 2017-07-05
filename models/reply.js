var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ReplySchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ups: {
        type: [ObjectId],
        ref: 'User',
        required: false
    }
});

//static methods
ReplySchema.statics.addReply = function(options, cb){
    return this.create(options, function(err, cb){
        cb(err, cb);
    });
};

ReplySchema.statics.getReplyCountByTopicId = function(topicId, cb){
    return this.count({
        post: topicId
    }, function(err, count){
        cb(err, count);
    });
};

var Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;