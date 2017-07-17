'use strict';

var mongoose = require('mongoose');
var q = require('q');

var schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    username: String,

    createdAt: Date,

    endedAt: Date,

    timeConsumed: Number,

    data: Object
});


function promise(query) {
    var deferred = q.defer();
    query.exec(function (err, result) {
        if (err) return deferred(err);
        return deferred.resolve(result);
    });
    return deferred.promise;
}

schema.statics.findById = function(id) {
    return promise(this.findOne({ _id: id }));
};


/** TODO: add pagination */
schema.statics.list = function () {
    var query = this.find({}).sort({ endedAt: -1 });
    return promise(query);
};



module.exports = mongoose.model('drawings', schema);