var request = require('request');

module.exports = function (router) {
    /**
     * 爬取CNodejs.org论坛数据
     * query: {limit,markdown}
     */
    router.get('/test/data', function (req, res, next) {
        var limit = req.query.limit || 100;
        var mdrender = req.query.markdown !== 'true';
        var url = `https://cnodejs.org/api/v1/topics?mdrender=${mdrender}&limit=${limit}`;
        request.get({
            uri: url,
            json: true
        }, function (err, response, body) {
            if (err || !response || !body) {
                return res.json({
                    message: `Can't get data `
                });
            }
            res.json(body);
        });
    });
};