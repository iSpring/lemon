var request = require('request');
var User = require('../models/user');
var Post = require('../models/post');

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

    function removeAll() {
        var p1 = removeAllUsers();
        var p2 = removeAllPosts();
        return Promise.all([p1, p2]);
    }

    //add topics.nameUserObj
    function createUsers(topics) {
        // return new Promise(function (resolve, reject) {

        // });
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

    function createTopics(topicsData) {
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

    function testData(limit, mdrender) {
        var topics = null;
        return fetchData(limit, mdrender).then(function (_topics) {
            topics = _topics;
            return removeAll();
        }).then(function () {
            return createUsers(topics);
        }).then(function(){
            return createTopics(topics);
        });
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

    router.get('/test/user/multiple', function (req, res, next) {
        var names = req.query.names.split(',');
        var defs = names.map(function (name) {
            return getUserInfo(name);
        });
        Promise.all(defs).then(function (users) {
            res.json(users);
        }, function (err) {
            res.json(err);
        }).catch(function (err) {
            res.json(err);
        });
    });

    router.get('/test/user/:name', function (req, res, next) {
        getUserInfo(req.params.name).then(function (user) {
            res.json(user);
        }, function (err) {
            res.json(err);
        }).catch(function (err) {
            res.json(err);
        });
    });
};