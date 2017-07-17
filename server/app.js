var express = require('express'),
    config = require('./app.config'),
    path = require('path'),
    bodyParser = require('body-parser'),
    drawingsCtrl = require('./drawings/drawings-controller'),
    mongoose = require('mongoose'),
    app = express();


mongoose.connect(config.dbStr);
mongoose.connection.on('error', function (err) {
    throw new Error('unable to connect to database at ' + err);
});


app.use(bodyParser.json());

/** api routes                  */
/****************************** */
app.get('/api/list', logRequest('GET api'), drawingsCtrl.list.get);
app.get('/api/drawing/:id', logRequest('GET api'), drawingsCtrl.drawing.get);
app.post('/api/drawing', logRequest('POST api'), drawingsCtrl.drawing.post);
app.put('/api/drawing/:id', logRequest('PUT api'), drawingsCtrl.drawing.put);




/** static client assets routes */
/****************************** */
app.get(['/client/**', '/bower_components/**'], logRequest('assets'), express.static(__dirname + '/..'));

app.get('/**', logRequest('index.html'), function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.use(logRequest('404'), function (req, res, next) {
    res.status(404).send('not found');
});


app.listen(config.port, function() {
    console.log('server is listening to port ' + config.port);
});

function logRequest(name) {
    return function (req, res, next) {
        console.log(name, req.originalUrl);
        next();
    }
}
