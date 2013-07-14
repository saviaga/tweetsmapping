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
    socket.on('start stream', function(opc) {
        tw.stream('statuses/filter', {
            track: "barcelona"
            //locations: "2.051,41.283,2.26,41.468"
        }, function(stream) {
            stream.on('data', function(data) {
                socket.emit('tweets', data);
            });
        });
    })
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
    app.use.apply(app, arguments);
};