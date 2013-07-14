/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 7/14/13 2:30 PM
 */

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    twitter = require('ntwitter'),
    tw = new twitter({
        consumer_key: '<your consumer key>',
        consumer_secret: '<your consumer secret>',
        access_token_key: '<your token>',
        access_token_secret: '<your access token secret>'
    });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    var twStream = null;
    socket.on('start stream', function(opc) {
        tw.stream('statuses/filter', opc, function(stream) {
            twStream = stream;
            stream.on('data', function(data) {
                socket.emit('tweets', data);
            });
        });
    });
    socket.on('stop stream', function() {
        if(twStream) twStream.destroy();
        twStream = null;
    });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
    app.use.apply(app, arguments);
};