var request = require('request');
var User = require('../models/user');
var Post = require('../models/post');
var Reply = require('../models/reply');

//access /test/data to import CNode.js data

//https://cnodejs.org/api/v1/topics
//https://cnodejs.org/api/v1/user/lellansin
//https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312

module.exports = function (router) {
    function getAllUsers(data) {
        return new Promise(function (resolve, reject) {
            var uniqueNamesObj = {};
            var defs = [];
            data.forEach(function (item) {
                var name = item.author.loginname;
                if (!uniqueNamesObj[name]) {
                    uniqueNamesObj[name] = true;
                    defs.push(getUserInfo(name));
                }
            });

            Promise.all(defs).then(function (users) {
                resolve(users);
            }, function (err) {
                reject(err);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    function getUserInfo(userName) {
        var promise = new Promise(function (resolve, reject) {
            //https://cnodejs.org/api/v1/user/lellansin
            var url = `https://cnodejs.org/api/v1/user/${userName}`;
            request.get({
                uri: url,
                json: true
            }, function (err, res, body) {
                if (err || !res || !body) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
        return promise;
    }
    

    /**
     * 爬取CNodejs.org论坛数据
     * query: {limit,markdown}
     */
    router.get('/test/data', function (req, res, next) {
        var limit = req.query.limit || 100;
        var mdrender = req.query.markdown !== 'true';
        testData(limit, mdrender).then(function () {
            res.redirect('/user/all');
        }, function (err) {
            next(err);
        });
    });

    function testData(limit, mdrender) {
        var topics = null;
        return fetchData(limit, mdrender).then(function (_topics) {
            topics = _topics;
            return removeAll();
        }).then(function () {
            return createUsers(topics);
        }).then(function(){
            return createPosts(topics);
        }).then(function(postDocs){
            var topicId = topics[0].id;
            var postDoc = postDocs[0];
            return parseSingleTopic(topicId, postDoc);
        });
    }

    /*---------------------------------parse topics page--------------------------------------- */

    //resolve topics
    function fetchData(limit, mdrender) {
        return new Promise(function (resolve, reject) {
            var url = `https://cnodejs.org/api/v1/topics?mdrender=${mdrender}&limit=${limit}`;
            request.get({
                uri: url,
                json: true
            }, function (err, response, body) {
                if (err || !response || !body || !body.success || !body.data) {
                    reject("Can't get data");
                } else {
                    var validTypes = ['share', 'ask', 'job'];
                    var topics = body.data;
                    topics.forEach(function (topic) {
                        if (validTypes.indexOf(topic.tab) < 0) {
                            topic.tab = 'share';
                        }
                    });
                    resolve(topics);
                }
            });
        });
    }

    //add topics.nameUserObj
    function createUsers(topics) {
        var uniqueNamesObj = {};
        var users = [];
        topics.forEach(function (topic) {
            var loginname = topic.author.loginname;
            if (!uniqueNamesObj[loginname]) {
                uniqueNamesObj[loginname] = true;
                users.push({
                    name: loginname,
                    avatarUrl: topic.author.avatar_url,
                    displayName: loginname,
                    signature: `我是${loginname}`
                });
            }
        });
        return User.create(users).then(function(docs){
            topics.nameUserObj = {};
            docs.forEach(function (user) {
                topics.nameUserObj[user.name] = user;
            });
            return docs;
        });
    }

    function createPosts(topicsData) {
        var topics = topicsData.map(function (item) {
            return {
                type: item.tab,
                title: item.title,
                content: item.content,
                user: topicsData.nameUserObj[item.author.loginname]._id,
                good: item.good,
                top: item.top,
                visitCount: item.visit_count,
                replyCount: item.reply_count,
                createAt: new Date(item.create_at)
            };
        });
        return Post.create(topics);
    }

    /*---------------------------------------parse one topic page------------------------*/

    function parseSingleTopic(topicId, postDoc){
        var nameUserObj = {};//{name: user}
        return fetchSingleTopic(topicId).then(function(topicDetail){
            //topicDetail is the data of https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312
            var uniqueNamesObj = {};
            var uniqueAuthors = [];
            var authors = [topicDetail.author];
            topicDetail.replies.forEach(function(reply){
                authors.push(reply.author);
            });            
            authors.forEach(function(author){
                if(!uniqueNamesObj[author.loginname]){
                    uniqueNamesObj[author.loginname] = true;
                    uniqueAuthors.push(author);
                }
            });
            //should serial execution
            var defs = uniqueAuthors.map(function(author){
                return findOrCreateUser(author);
            });
            return Promise.all(defs).then(function(userDocs){
                userDocs.forEach(function(userDoc){
                    nameUserObj[userDoc.name] = userDoc;
                });
                return topicDetail;
            });
        }).then(function(topicDetail){
            var defs = topicDetail.replies.map(function(replyItem){
                return addReply(replyItem, postDoc._id, nameUserObj);
            });
            if(defs.length > 0){
                return Promise.all(defs);
            }
        });
    }

    function fetchSingleTopic(topicId){
        var promise = new Promise(function (resolve, reject) {
            //https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312
            var url = `https://cnodejs.org/api/v1/topic/${topicId}`;
            request.get({
                uri: url,
                json: true
            }, function (err, res, body) {
                if (err || !res || !body || !body.success || !body.data) {
                    reject(err);
                } else {
                    resolve(body.data);
                }
            });
        });
        return promise;
    }

    function findOrCreateUser(author){
        var options = {
            name: author.loginname,
            avatarUrl: author.avatar_url,
            displayName: author.loginname,
            signature: `我是${author.loginname}`
        };
        return new Promise(function(resolve, reject){
            User.findOrCreateUser(options, function(err, user){
                if(err){
                    reject(err);
                }else{
                    resolve(user);
                }
            });
        });
    }

    function addReply(replyItem, myPostId, nameUserObj){
        var date = new Date(replyItem.create_at);
        var options = {
            user: nameUserObj[replyItem.author.loginname]._id,
            post: myPostId,
            content: replyItem.content,
            createAt: date,
            updateAt: date
        };
        return Reply.create(options);
    }

    /*---------------------------------------remove--------------------------------------*/
    function removeAll() {
        var p1 = removeAllUsers();
        var p2 = removeAllPosts();
        var p3 = removeAllReplies();
        return Promise.all([p1, p2, p3]);
    }

    function removeAllUsers() {
        return new Promise(function (resolve, reject) {
            User.remove({}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function removeAllPosts() {
        return new Promise(function (resolve, reject) {
            Post.remove({}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    function removeAllReplies(){
        return new Promise(function(resolve, reject){
            Reply.remove({}, function(err){
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }
};