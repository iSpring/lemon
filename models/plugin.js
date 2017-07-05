module.exports = function (scheme, options) {
    scheme.add({
        createAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        }
    });

    // if (options && options.index) {
    //     schema.path('updateAt').index(options.index)
    // }

    scheme.pre('save', function(next){
        this.updateAt = new Date();
        next();
    });
};