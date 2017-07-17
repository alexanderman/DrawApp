var model = require('./drawings-model'),
    q = require('q');


module.exports.drawing = {

    get: function(req, res) {
        model.findById(req.params.id)
        .then(function (doc) {
            if (!doc) return res.status(404).send();
            res.send(doc);
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
    },

    post: function(req, res) {
        var doc = new model(req.body);
        doc.save(function (err, doc) {
            if (err) return res.status(500).send(err);
            res.send(doc);
        });
    },

    put: function(req, res) {

        model.findById(req.params.id)
        .then(function (doc) {
            if (!doc) throw new Error('not found');
            return doc;
        })
        .then(function (doc) {

            Object.keys(req.body).forEach(function (key) {
                doc[key] = req.body[key];
            });
            doc.save(function (err, doc) {
                if (err) return res.status(500).send(err);
                res.send(doc);
            });

        })
        .catch(function (err) {
            res.status(500).send(err);
        });
    }

};



module.exports.list = {

    get: function(req, res) {
        model.list()
        .then(function (docList) {
            res.send(docList);
        })
        .catch(function (err) {
           res.status(500).send(err);
        });
    }

};